import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { initializeGoogleAuth, renderGoogleButton } from "../utils/googleAuth"



const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [emailError, setEmailError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Initialize Google Auth when component mounts
  useEffect(() => {
    const initGoogleAuth = () => {
      if (typeof google !== 'undefined' && google.accounts) {
        initializeGoogleAuth()
        // Render Google button after a short delay to ensure DOM is ready
        setTimeout(() => {
          renderGoogleButton('google-signin-button')
        }, 100)
      } else {
        // Retry if Google script hasn't loaded yet
        setTimeout(initGoogleAuth, 100)
      }
    }
    initGoogleAuth()
  }, [])

  const validateEmail = (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    return re.test(String(value).toLowerCase())
  }

  const onChange = (e) => {
    const { id, value } = e.target
    setForm((p) => ({ ...p, [id]: value }))
    if (id === 'email') {
      setEmailError(validateEmail(value) ? '' : 'Invalid email')
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    await submitLogin()
  }

  const submitLogin = async () => {
    if (!validateEmail(form.email)) {
      setEmailError('Invalid email')
      return
    }
    try {
      setSubmitting(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      navigate('/dashboard')
    } catch (err) {
      setEmailError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
  <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
  <Card className="w-full max-w-sm text-white ">
    <CardHeader className='flex justify-between'>
      <div className="flex items-end gap-1 bg-red-90">
        <p className="text-xl">Login </p> to your account
      </div>

       
        <Link to="/signup" className="bg-blue-90 py-1" >
          <button variant="link" className="cursor-pointer underline   hover:text-blue-400  text-[12px]">
            Signup
          </button>
        </Link>
       
    </CardHeader>

    {/* ⬇️ Wrap CardContent + CardFooter in ONE form */}
    <form
      onSubmit={(e) => {
        e.preventDefault();          // stop full page reload
        if (!submitting) submitLogin(); // call your existing login fn
      }}
    >
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="eg:- m@example.com"
              required
              aria-invalid={emailError ? true : undefined}
              className={emailError ? "border-red-500 focus-visible:ring-red-500" : ""}
              value={form.email}
              onChange={onChange}
            />
            {emailError ? <p className="text-red-500 text-xs">{emailError}</p> : null}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" autoComplete="current-password" required value={form.password} onChange={onChange} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        {/* ⬇️ KEY: submit button inside the form */}
        <Button
          disabled={submitting}
          type="submit"
          className="w-full text-white bg-black hover:bg-zinc-100 hover:text-black cursor-pointer mt-4" 
        >
          Login
        </Button>
        
        {/* Divider */}
        <div className="flex items-center w-full my-2">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>
        
        {/* Google Sign-In Button */}
        <div id="google-signin-button" className="w-full"></div>
      </CardFooter>
    </form>
  </Card>
</div>

  )
}

export default Login
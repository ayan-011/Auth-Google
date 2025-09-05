import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { initializeGoogleAuth, renderGoogleButton } from "../utils/googleAuth"



const Signup = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [emailError, setEmailError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Initialize Google Auth when component mounts
  useEffect(() => {
    const initGoogleAuth = () => {
      if (typeof google !== 'undefined' && google.accounts) {
        initializeGoogleAuth()
        // Render Google button after a short delay to ensure DOM is ready
        setTimeout(() => {
          renderGoogleButton('google-signin-button-signup')
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
    await submitSignup()
  }

  const submitSignup = async () => {
    if (!validateEmail(form.email)) {
      setEmailError('Invalid email')
      return
    }
    try {
      setSubmitting(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Signup failed')
      navigate('/dashboard')
    } catch (err) {
      setEmailError(err.message)
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="  h-screen w-full flex items-center justify-center bg-zinc-950">

    <Card className="w-full max-w-sm text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-1 "> <p className="text-xl">SignUp </p></CardTitle>
        <p className="text-[12px]">Create your account</p>
        
       
      </CardHeader>
        <form onSubmit={onSubmit}>
      <CardContent>
          <div className="flex flex-col gap-6">

            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="eg:- Ayaan Saifi"
                required
                value={form.username}
                onChange={onChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="eg:- m@example.com"
                required
                aria-invalid={emailError ? true : undefined}
                className={emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                value={form.email}
                onChange={onChange}
              />
              {emailError ? <p className="text-red-500 text-xs">{emailError}</p> : null}
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                 
              </div>
              <Input id="password" type="password" required value={form.password} onChange={onChange} />
            </div>
          </div>
      
      </CardContent>
      <CardFooter className="flex-col gap-2 bg-red-90">
        <Button disabled={submitting}  type="submit" onClick={submitSignup} className="w-full bg-black hover:bg-zinc-100 hover:text-black cursor-pointer mt-4">
          Signup
        </Button>
          
        
      </CardFooter>
      </form>

      <CardFooter className='bg-red-90 flex flex-col'>
        {/* Divider */}
        <div className="flex items-center w-full my-2">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>
        
        {/* Google Sign-In Button */}
        <div id="google-signin-button-signup" className="w-full"></div>
        
        <div className="flex items-center justify-center mt-4">
            <Link to="/login"  className="flex items-center ">
            <p className="text-[12px]">already have an account?</p>
          <Button variant="link" className="cursor-pointer -ml-2 text-blue-400 underline text-[12px] hover:text-blue-500" >Login</Button>            
            </Link>
        </div> 
      </CardFooter>
    </Card>

    </div>
  )
}

export default Signup
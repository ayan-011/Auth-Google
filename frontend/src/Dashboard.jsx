import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, {
          credentials: 'include',
        })
        if (res.status === 401) {
          navigate('/login')
          return
        }
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to load user')
        setUser(data.user)
      } catch (_e) {
        navigate('/login')
      }
    }
    load()
  }, [navigate])

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-white">
      <div className="flex flex-col items-center gap-4">
        {user?.picture ? (
          <img src={user.picture} alt="avatar" className="w-16 h-16 rounded-full" />
        ) : null}
        <h1 className="text-2xl">Dashboard</h1>
        {user ? <p className="text-sm text-zinc-300">Welcome, {user.username}</p> : null}
      </div>
    </div>
  )
}

export default Dashboard
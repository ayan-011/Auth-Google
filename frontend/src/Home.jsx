import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>Home

      <Link to="/signup">
      <button className='bg-black text-white p-2 rounded'>Signup</button>
      </Link>
      <Link to="/dashboard">
      <button className='bg-black text-white p-2 rounded'>Dashboard</button>
      </Link>
    </div>
  )
}

export default Home
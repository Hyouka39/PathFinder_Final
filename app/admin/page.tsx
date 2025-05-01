'use client'
import React, { useState } from 'react'
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Logo from '@/public/PATHFINDER-logo-edited.png'

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [username, setUsername] = useState('')
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'Drew27' && passwordValue === 'admin') {
      alert('Login Successfully')
      router.push('/admin/dashboard') // Redirect to the updated dashboard path
    } else {
      alert('Invalid credentials')
      clearInputs()
    }
  }

  const clearInputs = () => {
    setUsername('')
    setPasswordValue('')
  }

  return (
    <div className="flex justify-center items-center absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_30%,#fff_1%,#7d6655_100%)]">
      <div className="bg-brown-1 p-8 md:p-12 lg:p-16 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-center mb-6">
          <Image src={Logo} alt="Company Logo" width={170} height={170} />
        </div>
        <h2 className="text-4xl font-semibold mb-6 text-center text-black">PathFinder</h2>
        <form onSubmit={handleLogin} autoComplete="off">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full p-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-brown-1 text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
            <FaUser className="absolute right-3 top-3 text-black" />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full p-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-700 bg-brown-1 text-black"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              autoComplete="off"
            />
            {passwordValue && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-black focus:outline-none"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            )}
            {!passwordValue && <FaLock className="absolute right-3 top-3 text-black" />}
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-brown-6 text-white rounded-lg hover:bg-brown-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import axios from 'axios'

const SignInComponent = () => {
  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")
  const [error , setError] = useState("")
  const [success , setSuccess] = useState("")
  const [loading , setLoading] = useState(false)

  const handleLogin = async (e : any) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email || !password) {
      setError("Please enter all the fields correctly")
      return
    }

    try {
      setLoading(true)

      const res = await axios.post("http://localhost:3001/api/v1/signin", {
        email,
        password
      })
      
      localStorage.setItem("token", res.data.token)

      setSuccess(res.data.message || "SignIn Successful")
      setEmail("")
      setPassword("")
    } catch (error) {
      setError("SignIn Failed! Please Try Again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <form 
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Sign In</h2>

        <input
          type="email"
          placeholder="Enter Your Email"
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Your Password"
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          disabled={loading}
          type="submit"
          className="w-full"
        >
          {loading ? "Loading..." : "Sign In"}
        </Button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

      </form>
    </div>
  )
}

export default SignInComponent

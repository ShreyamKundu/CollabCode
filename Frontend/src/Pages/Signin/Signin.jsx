"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useFirebase } from "../../Context/FirebaseContext"
import { useDispatch } from "react-redux"
import { setUsername } from "../../../features/userSlice"

const SignIn = () => {
  const firebase = useFirebase()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const handleInputChange = (e) => {
    const { value, name } = e.target
    if (name === "email") {
      setEmail(value)
    } else if (name === "password") {
      setPassword(value)
    }
    setIsButtonDisabled(email === "" || password === "")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    firebase
      .signInUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user
        if (user) {
          dispatch(setUsername(user.displayName || user.email))
          navigate("/dashboard")
        }
      })
      .catch((error) => {
        console.error("Something went wrong:", error.message)
      })
  }

  const signinwithgoogle = () => {
    firebase
      .signInUserWithGoogle()
      .then((result) => {
        const user = result.user
        dispatch(setUsername(user.displayName))
        navigate("/dashboard")
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error.message)
      })
  }

  return (
    <main className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-zinc-900 rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-400">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white shadow-sm placeholder-zinc-400 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white shadow-sm placeholder-zinc-400 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isButtonDisabled}
            className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg bg-zinc-100 text-black hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sign in
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-900 text-zinc-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={signinwithgoogle}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-semibold rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 focus:ring-offset-zinc-900 transition-colors"
          >
            <img src="./google-color.svg" alt="Google logo" className="w-5 h-5" />
            Sign in with Google
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Not a member yet?{" "}
          <Link to="/signup" className="font-medium text-zinc-300 hover:text-white transition-colors">
            Sign up now
          </Link>
        </p>
      </div>
    </main>
  )
}

export default SignIn


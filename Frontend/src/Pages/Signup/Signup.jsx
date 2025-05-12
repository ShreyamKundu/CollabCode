"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useFirebase } from "../../Context/FirebaseContext"
import { updateProfile } from "firebase/auth"
import { auth } from "../../firebase"
import { useDispatch } from "react-redux"
import { setUsername as setReduxUsername } from "../../../features/userSlice"
import { axiosInstance } from "../../../utils/index"

const SignUp = () => {
  const firebase = useFirebase()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let isDisabled = true
    switch (name) {
      case "username":
        setUsername(value)
        isDisabled = value === "" || email === "" || password === "" || password.length < 6
        break
      case "email":
        setEmail(value)
        isDisabled = username === "" || value === "" || password === "" || password.length < 6
        break
      case "password":
        setPassword(value)
        isDisabled = username === "" || email === "" || value === "" || value.length < 6
        break
      default:
        break
    }
    setIsButtonDisabled(isDisabled)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      alert("Password should be at least 6 characters long")
      setIsButtonDisabled(false)
      return
    }

    try {
      await firebase.signupUserwithEmailAndPassword(email, password)
      const user = auth.currentUser
      if (user) {
        await updateProfile(user, { displayName: username })
        dispatch(setReduxUsername(user.displayName))

        const result = await axiosInstance.post("/api/v1/auth/register", {
          name: username,
          email: user.email,
          uid: user.uid,
        })
        console.log(result)
        navigate("/signin")
      }
    } catch (error) {
      console.error("Error signing up:", error.message)
      alert("Something went wrong")
      setIsButtonDisabled(false)
    }
  }

  const signinwithgoogle = async () => {
    try {
      const userCredential = await firebase.signInUserWithGoogle()
      const { email, uid, displayName } = userCredential.user
      console.log(displayName, email, uid)
      const result = await axiosInstance.post("/api/v1/auth/register", {
        name: displayName,
        email,
        uid,
      })
      navigate("/dashboard")
    } catch (error) {
      console.error("Error signing up with Google:", error.message)
    }
  }

  return (
    <main className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-zinc-900 rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create an account</h1>
          <p className="mt-2 text-sm text-zinc-400">Join us today and get started</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white shadow-sm placeholder-zinc-400 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                placeholder="Enter your username"
              />
            </div>

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
                placeholder="name@example.com"
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
              <p className="mt-1 text-xs text-zinc-500">Must be at least 6 characters long</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isButtonDisabled}
            className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg bg-zinc-100 text-black hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create account
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
            Sign up with Google
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-zinc-300 hover:text-white transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

export default SignUp


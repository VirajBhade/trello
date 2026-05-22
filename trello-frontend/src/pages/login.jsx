import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      const formData = new URLSearchParams()

      formData.append("username", email)
      formData.append("password", password)

      const response = await api.post(
        "/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )

      const token = response.data.access_token

      localStorage.setItem("token", token)

      navigate("/teams")

    } catch (error) {

      console.log(error)

      alert("Invalid Credentials")

    }

  }

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 overflow-hidden relative">

      {/* BACKGROUND GLOW */}

      <div className="absolute w-[500px] h-[500px] bg-blue-500 opacity-20 blur-[120px] rounded-full top-[-100px] left-[-100px]"></div>

      <div className="absolute w-[400px] h-[400px] bg-purple-500 opacity-20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* LOGIN CARD */}

      <div className="relative z-10 w-full max-w-md">

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-3xl p-10">

          {/* HEADER */}

          <div className="text-center mb-10">

            <h1 className="text-5xl font-extrabold text-white mb-4">
              Welcome Back
            </h1>

            <p className="text-gray-400 text-lg">
              Login to continue managing your workspace
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-6"
          >

            <div>

              <label className="text-gray-300 block mb-2 text-sm">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-2xl outline-none focus:border-blue-500 transition"
              />

            </div>

            <div>

              <label className="text-gray-300 block mb-2 text-sm">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-2xl outline-none focus:border-blue-500 transition"
              />

            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 hover:scale-105 transition duration-300 text-white py-4 rounded-2xl text-lg font-semibold shadow-xl"
            >
              Login
            </button>

          </form>

          {/* FOOTER */}

          <div className="mt-8 text-center">

            <p className="text-gray-400">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Register
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  )

}

export default Login
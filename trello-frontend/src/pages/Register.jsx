import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"

function Register() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleRegister = async (e) => {

    e.preventDefault()

    try {

      await api.post("/auth/register", {
        name,
        email,
        password
      })

      alert("Registration Successful")

      navigate("/login")

    } catch (error) {

      console.log(error)

      alert("Registration Failed")

    }

  }

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 overflow-hidden relative">

      {/* BACKGROUND GLOW */}

      <div className="absolute w-[500px] h-[500px] bg-purple-500 opacity-20 blur-[120px] rounded-full top-[-100px] left-[-100px]"></div>

      <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* REGISTER CARD */}

      <div className="relative z-10 w-full max-w-md">

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-3xl p-10">

          {/* HEADER */}

          <div className="text-center mb-10">

            <h1 className="text-5xl font-extrabold text-white mb-4">
              Create Account
            </h1>

            <p className="text-gray-400 text-lg">
              Start managing your teams and projects
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-6"
          >

            <div>

              <label className="text-gray-300 block mb-2 text-sm">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-2xl outline-none focus:border-purple-500 transition"
              />

            </div>

            <div>

              <label className="text-gray-300 block mb-2 text-sm">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-2xl outline-none focus:border-purple-500 transition"
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
                className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-2xl outline-none focus:border-purple-500 transition"
              />

            </div>

            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 hover:scale-105 transition duration-300 text-white py-4 rounded-2xl text-lg font-semibold shadow-xl"
            >
              Create Account
            </button>

          </form>

          {/* FOOTER */}

          <div className="mt-8 text-center">

            <p className="text-gray-400">

              Already have an account?{" "}

              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  )

}

export default Register
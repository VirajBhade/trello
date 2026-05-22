import { useState } from "react"
import api from "../services/api"

function Signup() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault()

    try {

      const response = await api.post("/auth/signup", {
        name,
        email,
        password
      })

      alert("Signup Successful")

      console.log(response.data)

    } catch (error) {

      console.log(error)

      alert("Signup Failed")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">

      <div className="bg-white p-8 rounded-2xl w-[400px] shadow-2xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          Signup
        </h1>

        <form
          onSubmit={handleSignup}
          className="flex flex-col gap-4"
        >

          <input
            type="text"
            placeholder="Enter name"
            className="border p-3 rounded-lg"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter email"
            className="border p-3 rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            className="border p-3 rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
          >
            Signup
          </button>

        </form>

      </div>

    </div>
  )
}

export default Signup
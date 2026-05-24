import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)
      const response = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      localStorage.setItem("token", response.data.access_token)
      navigate("/teams")
    } catch (err) {
      console.log(err)
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .auth-root { font-family: 'DM Sans', sans-serif; }
        .auth-display { font-family: 'Syne', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .delay-1 { animation-delay: 0.08s; }
        .delay-2 { animation-delay: 0.16s; }
        .delay-3 { animation-delay: 0.24s; }
        .delay-4 { animation-delay: 0.32s; }
        .input-field {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: rgba(99,102,241,0.6);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
          outline: none;
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-6px); }
          40%      { transform: translateX(6px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
        .shake { animation: shake 0.4s ease; }
      `}</style>

      <div className="auth-root min-h-screen bg-[#08090c] grid-bg flex items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[110px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-sm">

          {/* Logo mark */}
          <div className="fade-up flex justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-white font-bold text-sm auth-display">W</span>
            </div>
          </div>

          {/* Heading */}
          <div className="fade-up delay-1 text-center mb-8">
            <h1 className="auth-display text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h1>
            <p className="text-white/30 text-sm">Sign in to your workspace</p>
          </div>

          {/* Card */}
          <div className="fade-up delay-2 bg-[#0f1117] border border-white/[0.07] rounded-2xl p-7">

            {/* Error */}
            {error && (
              <div className="shake mb-5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">

              {/* Email */}
              <div>
                <label className="text-white/40 text-xs font-semibold uppercase tracking-widest block mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field w-full rounded-xl px-4 py-3 text-white placeholder-white/15 text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-white/40 text-xs font-semibold uppercase tracking-widest block mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field w-full rounded-xl px-4 py-3 text-white placeholder-white/15 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors text-xs"
                  >
                    {showPassword ? "hide" : "show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : "Sign in →"}
              </button>

            </form>
          </div>

          {/* Footer */}
          <div className="fade-up delay-3 mt-6 text-center">
            <p className="text-white/25 text-xs">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  )
}

export default Login

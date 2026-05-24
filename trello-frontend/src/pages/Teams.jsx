import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import api from "../services/api"

const TEAM_COLORS = [
  { from: "from-violet-500", to: "to-purple-600", glow: "shadow-violet-500/20", border: "hover:border-violet-500/30", ring: "ring-violet-500/20" },
  { from: "from-sky-500", to: "to-blue-600", glow: "shadow-sky-500/20", border: "hover:border-sky-500/30", ring: "ring-sky-500/20" },
  { from: "from-emerald-500", to: "to-teal-600", glow: "shadow-emerald-500/20", border: "hover:border-emerald-500/30", ring: "ring-emerald-500/20" },
  { from: "from-rose-500", to: "to-pink-600", glow: "shadow-rose-500/20", border: "hover:border-rose-500/30", ring: "ring-rose-500/20" },
  { from: "from-amber-500", to: "to-orange-500", glow: "shadow-amber-500/20", border: "hover:border-amber-500/30", ring: "ring-amber-500/20" },
  { from: "from-fuchsia-500", to: "to-violet-600", glow: "shadow-fuchsia-500/20", border: "hover:border-fuchsia-500/30", ring: "ring-fuchsia-500/20" },
]

function TeamCard({ team, onClick, colorIndex }) {
  const c = TEAM_COLORS[colorIndex % TEAM_COLORS.length]
  const initials = team.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer relative bg-[#0f1117] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 ${c.border} overflow-hidden`}
    >
      {/* Corner accent */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${c.from} ${c.to} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-300`} />

      {/* Avatar + Arrow */}
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.from} ${c.to} flex items-center justify-center text-white font-bold text-sm shadow-lg ring-4 ${c.ring} select-none`}>
          {initials}
        </div>
        <span className="text-white/20 group-hover:text-white/50 text-lg transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
      </div>

      {/* Info */}
      <div>
        <h3 className="text-white font-semibold text-base mb-1 truncate">{team.name}</h3>
        <p className="text-white/25 text-xs leading-relaxed">
          Workspace · click to view projects
        </p>
      </div>

      {/* Footer tag */}
      <div className={`self-start text-xs font-semibold px-2.5 py-1 rounded-lg bg-gradient-to-r ${c.from} ${c.to} bg-opacity-10 text-white/60 bg-white/[0.05] border border-white/[0.06]`}>
        Team
      </div>
    </div>
  )
}

function Teams() {
  const [teamName, setTeamName] = useState("")
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const fetchTeams = async () => {
    try {
      const response = await api.get("/teams", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTeams(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const createTeam = async () => {
    if (!teamName.trim()) return
    setCreating(true)
    try {
      await api.post("/teams", { name: teamName }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTeamName("")
      fetchTeams()
    } catch (error) {
      console.log(error)
    } finally {
      setCreating(false)
    }
  }

  const handleKeyDown = (e) => { if (e.key === "Enter") createTeam() }

  useEffect(() => { fetchTeams() }, [])

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .teams-root { font-family: 'DM Sans', sans-serif; }
        .teams-display { font-family: 'Syne', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .card-stagger:nth-child(1) { animation-delay: 0.05s; }
        .card-stagger:nth-child(2) { animation-delay: 0.10s; }
        .card-stagger:nth-child(3) { animation-delay: 0.15s; }
        .card-stagger:nth-child(4) { animation-delay: 0.20s; }
        .card-stagger:nth-child(5) { animation-delay: 0.25s; }
        .card-stagger:nth-child(6) { animation-delay: 0.30s; }
        .input-glow:focus { box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <div className="teams-root min-h-screen bg-[#08090c] grid-bg text-white relative overflow-hidden">
        {/* Ambient glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-600/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sky-600/6 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

          {/* Header */}
          <div className="fade-up mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Workspace</span>
            </div>
            <h1 className="teams-display text-5xl font-extrabold text-white tracking-tight mb-1">Your Teams</h1>
            <p className="text-white/30 text-sm">
              {teams.length} team{teams.length !== 1 ? "s" : ""} · click any to view projects
            </p>
          </div>

          {/* Create Team */}
          <div className="fade-up mb-10" style={{ animationDelay: "0.1s" }}>
            <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-3">New Team</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Team name…"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input-glow flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-indigo-500/60 transition-all duration-200"
                />
                <button
                  onClick={createTeam}
                  disabled={creating || !teamName.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 whitespace-nowrap"
                >
                  {creating ? "Creating…" : "+ Create"}
                </button>
              </div>
            </div>
          </div>

          {/* Teams Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#0f1117] border border-white/[0.06] rounded-2xl p-6 h-44 animate-pulse" />
              ))}
            </div>
          ) : teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-3xl">👥</div>
              <p className="text-white/20 text-sm">No teams yet. Create one above.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {teams.map((team, i) => (
                <div key={team.id} className="fade-up card-stagger">
                  <TeamCard
                    team={team}
                    onClick={() => navigate(`/projects/${team.id}`)}
                    colorIndex={i}
                  />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}

export default Teams

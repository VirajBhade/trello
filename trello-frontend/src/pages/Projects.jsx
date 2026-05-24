import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Layout from "../components/Layout"
import api from "../services/api"

const COLORS = [
  { bg: "from-violet-500 to-purple-600", ring: "ring-violet-500/30", dot: "bg-violet-400" },
  { bg: "from-sky-500 to-blue-600", ring: "ring-sky-500/30", dot: "bg-sky-400" },
  { bg: "from-emerald-500 to-teal-600", ring: "ring-emerald-500/30", dot: "bg-emerald-400" },
  { bg: "from-rose-500 to-pink-600", ring: "ring-rose-500/30", dot: "bg-rose-400" },
  { bg: "from-amber-500 to-orange-600", ring: "ring-amber-500/30", dot: "bg-amber-400" },
  { bg: "from-fuchsia-500 to-violet-600", ring: "ring-fuchsia-500/30", dot: "bg-fuchsia-400" },
]

function ProjectCard({ project, onDelete, onOpen, colorIndex }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const color = COLORS[colorIndex % COLORS.length]

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    setDeleting(true)
    await onDelete(project.id)
  }

  return (
    <div
      className="group relative bg-[#0f1117] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-5 hover:border-white/[0.14] transition-all duration-300 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1"
      style={{ animationFillMode: "both" }}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.bg} flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ${color.ring} select-none`}>
          {project.name.charAt(0).toUpperCase()}
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
            confirmDelete
              ? "bg-red-500 text-white animate-pulse"
              : "bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-400"
          }`}
        >
          {deleting ? "Removing…" : confirmDelete ? "Confirm?" : "Delete"}
        </button>
      </div>

      {/* Info */}
      <div>
        <h3 className="text-white font-semibold text-lg leading-snug mb-1 truncate">{project.name}</h3>
        <p className="text-white/30 text-sm leading-relaxed">
          Track tasks, manage milestones, and ship faster.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center gap-3">
        <button
          onClick={() => onOpen(project.id)}
          className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r ${color.bg} text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:scale-[1.02] active:scale-95`}
        >
          Open Tasks →
        </button>
      </div>

      {/* Subtle corner accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5 bg-gradient-to-br ${color.bg} pointer-events-none`} />
    </div>
  )
}

function Projects() {
  const { teamId } = useParams()
  const [projectName, setProjectName] = useState("")
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const fetchProjects = async () => {
    try {
      const response = await api.get(`/projects/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProjects(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async () => {
    if (!projectName.trim()) return
    setCreating(true)
    try {
      await api.post(
        "/projects",
        { name: projectName, team_id: Number(teamId) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProjectName("")
      fetchProjects()
    } catch (error) {
      console.log(error)
    } finally {
      setCreating(false)
    }
  }

  const deleteProject = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchProjects()
    } catch (error) {
      console.log(error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") createProject()
  }

  useEffect(() => { fetchProjects() }, [])

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .proj-root { font-family: 'DM Sans', sans-serif; }
        .proj-display { font-family: 'Syne', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.5s ease both;
        }
        .card-stagger:nth-child(1) { animation-delay: 0.05s; }
        .card-stagger:nth-child(2) { animation-delay: 0.10s; }
        .card-stagger:nth-child(3) { animation-delay: 0.15s; }
        .card-stagger:nth-child(4) { animation-delay: 0.20s; }
        .card-stagger:nth-child(5) { animation-delay: 0.25s; }
        .card-stagger:nth-child(6) { animation-delay: 0.30s; }
        .card-stagger:nth-child(7) { animation-delay: 0.35s; }
        .card-stagger:nth-child(8) { animation-delay: 0.40s; }

        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <div className="proj-root min-h-screen bg-[#08090c] grid-bg text-white relative overflow-hidden">

        {/* Ambient glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-600/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

          {/* Header */}
          <div className="fade-up mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
                Team Workspace
              </span>
            </div>
            <h1 className="proj-display text-5xl font-extrabold text-white mb-2 tracking-tight">
              Projects
            </h1>
            <p className="text-white/35 text-base">
              {projects.length} project{projects.length !== 1 ? "s" : ""} · organize, ship, repeat.
            </p>
          </div>

          {/* Create Project Panel */}
          <div className="fade-up mb-10" style={{ animationDelay: "0.1s" }}>
            <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-6">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">
                New Project
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Project name…"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input-glow flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-violet-500/60 transition-all duration-200"
                />
                <button
                  onClick={createProject}
                  disabled={creating || !projectName.trim()}
                  className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 active:scale-95 whitespace-nowrap"
                >
                  {creating ? "Creating…" : "+ Create"}
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#0f1117] border border-white/[0.06] rounded-2xl p-6 h-52 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-3xl">
                📁
              </div>
              <p className="text-white/25 text-sm">No projects yet. Create one above.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project, i) => (
                <div key={project.id} className="fade-up card-stagger">
                  <ProjectCard
                    project={project}
                    onDelete={deleteProject}
                    onOpen={(id) => navigate(`/tasks/${id}`)}
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

export default Projects

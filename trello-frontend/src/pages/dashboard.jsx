import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import api from "../services/api"

const STAT_CARDS = [
  {
    key: "teams",
    label: "Teams",
    icon: "👥",
    accent: "from-indigo-500 to-violet-600",
    glow: "bg-indigo-500/10",
    border: "hover:border-indigo-500/30",
    ring: "ring-indigo-500/20",
    text: "text-indigo-400",
  },
  {
    key: "projects",
    label: "Projects",
    icon: "📁",
    accent: "from-sky-500 to-blue-600",
    glow: "bg-sky-500/10",
    border: "hover:border-sky-500/30",
    ring: "ring-sky-500/20",
    text: "text-sky-400",
  },
  {
    key: "tasks",
    label: "Total Tasks",
    icon: "✦",
    accent: "from-amber-500 to-orange-500",
    glow: "bg-amber-500/10",
    border: "hover:border-amber-500/30",
    ring: "ring-amber-500/20",
    text: "text-amber-400",
  },
]

function StatCard({ config, value, loading }) {
  return (
    <div className={`group relative bg-[#0f1117] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 overflow-hidden ${config.border}`}>
      {/* BG glow */}
      <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full ${config.glow} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${config.accent} flex items-center justify-center text-lg shadow-lg ring-4 ${config.ring} select-none`}>
        {config.icon}
      </div>

      <div>
        {loading ? (
          <div className="h-9 w-16 bg-white/[0.06] rounded-lg animate-pulse mb-1" />
        ) : (
          <p className="text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            {value}
          </p>
        )}
        <p className="text-white/30 text-sm mt-1">{config.label}</p>
      </div>
    </div>
  )
}

function TaskBreakdownBar({ tasks }) {
  const total = tasks.length
  if (total === 0) return null

  const todo = tasks.filter(t => !t.status || t.status === "todo" || t.status === "Not Started").length
  const inProgress = tasks.filter(t => t.status === "In Progress").length
  const completed = tasks.filter(t => t.status === "Completed").length

  const pct = (n) => Math.round((n / total) * 100)

  const segments = [
    { label: "To Do", value: todo, pct: pct(todo), color: "bg-slate-500", dot: "bg-slate-400", text: "text-slate-400" },
    { label: "In Progress", value: inProgress, pct: pct(inProgress), color: "bg-amber-400", dot: "bg-amber-400", text: "text-amber-400" },
    { label: "Completed", value: completed, pct: pct(completed), color: "bg-emerald-400", dot: "bg-emerald-400", text: "text-emerald-400" },
  ]

  return (
    <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-6">
      <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-5">Task Breakdown</p>

      {/* Stacked bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-6">
        {segments.map((s) => (
          s.value > 0 && (
            <div
              key={s.label}
              className={`${s.color} rounded-full transition-all duration-700`}
              style={{ width: `${s.pct}%` }}
            />
          )
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4">
        {segments.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.label === "In Progress" ? "animate-pulse" : ""}`} />
              <span className="text-white/30 text-xs">{s.label}</span>
            </div>
            <p className={`text-xl font-bold ${s.text}`} style={{ fontFamily: "'Syne', sans-serif" }}>{s.value}</p>
            <p className="text-white/20 text-xs">{s.pct}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Dashboard() {
  const [teams, setTeams] = useState([])
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const fetchDashboardData = async () => {
    try {
      const teamsRes = await api.get("/teams", { headers: { Authorization: `Bearer ${token}` } })
      setTeams(teamsRes.data)

      try {
        const projectsRes = await api.get("/projects/all", { headers: { Authorization: `Bearer ${token}` } })
        setProjects(projectsRes.data)
      } catch { setProjects([]) }

      try {
        const tasksRes = await api.get("/tasks/all", { headers: { Authorization: `Bearer ${token}` } })
        setTasks(tasksRes.data)
      } catch { setTasks([]) }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // Derive greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  // Completion rate
  const completedTasks = tasks.filter(t => t.status === "Completed").length
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  useEffect(() => { fetchDashboardData() }, [])

  const counts = { teams: teams.length, projects: projects.length, tasks: tasks.length }

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .dash-root { font-family: 'DM Sans', sans-serif; }
        .dash-display { font-family: 'Syne', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.10s; }
        .d3 { animation-delay: 0.15s; }
        .d4 { animation-delay: 0.20s; }
        .d5 { animation-delay: 0.25s; }
        .d6 { animation-delay: 0.30s; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .progress-bar { transition: width 0.9s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>

      <div className="dash-root min-h-screen bg-[#08090c] grid-bg text-white relative overflow-hidden">

        {/* Ambient glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/6 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-sky-600/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

          {/* Header */}
          <div className="fade-up mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Overview</span>
            </div>
            <h1 className="dash-display text-5xl font-extrabold text-white tracking-tight mb-1">
              {greeting} 👋
            </h1>
            <p className="text-white/30 text-sm">
              Here's what's happening across your workspace.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {STAT_CARDS.map((cfg, i) => (
              <div key={cfg.key} className={`fade-up d${i + 1}`}>
                <StatCard config={cfg} value={counts[cfg.key]} loading={loading} />
              </div>
            ))}
          </div>

          {/* Second row — completion rate + task breakdown */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">

            {/* Completion Rate */}
            <div className="fade-up d4 bg-[#0f1117] border border-white/[0.07] rounded-2xl p-6">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-5">Completion Rate</p>
              <div className="flex items-end gap-3 mb-4">
                <p className={`dash-display text-5xl font-extrabold ${completionRate === 100 ? "text-emerald-400" : "text-white"}`}>
                  {loading ? "—" : `${completionRate}%`}
                </p>
                <p className="text-white/25 text-sm mb-1.5">tasks done</p>
              </div>
              <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full progress-bar ${completionRate === 100 ? "bg-emerald-400" : "bg-gradient-to-r from-indigo-500 to-violet-400"}`}
                  style={{ width: loading ? "0%" : `${completionRate}%` }}
                />
              </div>
              <p className="text-white/20 text-xs mt-2">
                {completedTasks} of {tasks.length} tasks completed
              </p>
            </div>

            {/* Task Breakdown */}
            <div className="fade-up d5">
              {loading ? (
                <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-6 h-full animate-pulse" />
              ) : (
                <TaskBreakdownBar tasks={tasks} />
              )}
            </div>
          </div>

          {/* Quick Actions + Summary */}
          <div className="grid md:grid-cols-3 gap-5">

            {/* Quick Actions */}
            <div className="fade-up d5 md:col-span-1 bg-[#0f1117] border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-3">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-1">Quick Actions</p>
              {[
                { label: "Go to Teams", icon: "👥", path: "/teams", accent: "hover:border-indigo-500/30 hover:text-indigo-400" },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className={`flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white/50 text-sm font-medium transition-all duration-200 hover:bg-white/[0.06] ${action.accent} hover:-translate-y-0.5 text-left`}
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                  <span className="ml-auto opacity-40">→</span>
                </button>
              ))}
            </div>

            {/* Workspace Summary */}
            <div className="fade-up d6 md:col-span-2 bg-[#0f1117] border border-white/[0.07] rounded-2xl p-6">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-5">Workspace Summary</p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: "⊞", text: "Manage multiple teams and collaborate efficiently" },
                  { icon: "◈", text: "Organize projects with structured workflow management" },
                  { icon: "✦", text: "Track tasks across To Do, In Progress, and Completed" },
                  { icon: "⚡", text: "Full-stack productivity platform — built and deployed" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <span className="text-indigo-400/60 text-sm mt-0.5 shrink-0">{item.icon}</span>
                    <p className="text-white/35 text-sm leading-relaxed group-hover:text-white/55 transition-colors duration-200">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Dashboard

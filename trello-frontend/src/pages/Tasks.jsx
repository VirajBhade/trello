import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Layout from "../components/Layout"
import api from "../services/api"

const STATUS_CONFIG = {
  todo: {
    label: "To Do",
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/20",
    dot: "bg-slate-400",
    badge: "bg-slate-800 text-slate-300",
    pill: "bg-slate-500/15 text-slate-300 border-slate-500/20",
  },
  "In Progress": {
    label: "In Progress",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    dot: "bg-amber-400",
    badge: "bg-amber-900/40 text-amber-300",
    pill: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  },
  Completed: {
    label: "Completed",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    dot: "bg-emerald-400",
    badge: "bg-emerald-900/40 text-emerald-300",
    pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  },
}

const ALL_STATUSES = ["todo", "In Progress", "Completed"]

function TaskCard({ task, onDelete, onStatusChange }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [updating, setUpdating] = useState(false)
  const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG["todo"]

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    await onDelete(task.id)
  }

  const handleStatus = async (newStatus) => {
    setUpdating(true)
    await onStatusChange(task.id, newStatus)
    setUpdating(false)
  }

  return (
    <div className={`group relative bg-[#0f1117] border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/50 ${cfg.border} hover:border-opacity-60`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`shrink-0 w-2 h-2 rounded-full ${cfg.dot} ${task.status === "In Progress" ? "animate-pulse" : ""}`} />
          <h3 className={`text-white/90 font-semibold text-sm leading-snug truncate ${task.status === "Completed" ? "line-through text-white/40" : ""}`}>
            {task.title}
          </h3>
        </div>
        <button
          onClick={handleDelete}
          className={`shrink-0 text-xs px-2.5 py-1 rounded-lg font-medium transition-all duration-200 ${
            confirmDelete
              ? "bg-red-500 text-white animate-pulse"
              : "text-white/20 hover:text-red-400 hover:bg-red-500/10"
          }`}
        >
          {confirmDelete ? "Sure?" : "✕"}
        </button>
      </div>

      {/* Status badge */}
      <div className={`self-start text-xs font-semibold px-2.5 py-1 rounded-lg border ${cfg.pill}`}>
        {cfg.label}
      </div>

      {/* Status Buttons */}
      <div className="flex gap-2 flex-wrap">
        {ALL_STATUSES.map((s) => {
          const c = STATUS_CONFIG[s]
          const isActive = task.status === s
          return (
            <button
              key={s}
              onClick={() => !isActive && handleStatus(s)}
              disabled={updating || isActive}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all duration-200 ${
                isActive
                  ? `${c.badge} border-transparent cursor-default`
                  : "bg-white/[0.03] border-white/[0.06] text-white/30 hover:text-white/70 hover:bg-white/[0.06] hover:border-white/10 cursor-pointer"
              }`}
            >
              {updating && isActive ? "…" : c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function KanbanColumn({ status, tasks, onDelete, onStatusChange }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className={`text-xs font-bold uppercase tracking-widest ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        <span className="text-xs text-white/20 font-mono font-semibold bg-white/[0.04] px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Divider */}
      <div className={`h-px ${cfg.bg} mb-1`} />

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="border border-dashed border-white/[0.06] rounded-2xl p-6 text-center text-white/15 text-xs">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="fade-up">
              <TaskCard task={task} onDelete={onDelete} onStatusChange={onStatusChange} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function Tasks() {
  const { projectId } = useParams()
  const [title, setTitle] = useState("")
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [view, setView] = useState("kanban") // "kanban" | "list"
  const token = localStorage.getItem("token")

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/tasks/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async () => {
    if (!title.trim()) return
    setCreating(true)
    try {
      await api.post(
        "/tasks",
        { title, project_id: Number(projectId) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTitle("")
      fetchTasks()
    } catch (error) {
      console.log(error)
    } finally {
      setCreating(false)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchTasks()
    } catch (error) {
      console.log(error)
    }
  }

  const updateStatus = async (taskId, status) => {
    try {
      await api.put(
        `/tasks/${taskId}?status=${status}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchTasks()
    } catch (error) {
      console.log(error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") createTask()
  }

  useEffect(() => { fetchTasks() }, [])

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo" || t.status === "Not Started" || !t.status),
    "In Progress": tasks.filter((t) => t.status === "In Progress"),
    Completed: tasks.filter((t) => t.status === "Completed"),
  }

  const total = tasks.length
  const done = tasksByStatus["Completed"].length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .task-root { font-family: 'DM Sans', sans-serif; }
        .task-display { font-family: 'Syne', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.35s ease both; }

        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.12);
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .progress-bar {
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      <div className="task-root min-h-screen bg-[#08090c] grid-bg text-white relative overflow-hidden">

        {/* Ambient glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-amber-600/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-600/6 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

          {/* Header */}
          <div className="fade-up mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Project Board
              </span>
            </div>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <h1 className="task-display text-5xl font-extrabold text-white mb-1 tracking-tight">
                  Tasks
                </h1>
                <p className="text-white/30 text-sm">
                  {total} task{total !== 1 ? "s" : ""} · {done} completed
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-xl p-1">
                <button
                  onClick={() => setView("kanban")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${view === "kanban" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
                >
                  ⊞ Board
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${view === "list" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
                >
                  ≡ List
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {total > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/25 text-xs">Progress</span>
                  <span className={`text-xs font-bold ${progress === 100 ? "text-emerald-400" : "text-white/40"}`}>{progress}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full progress-bar ${progress === 100 ? "bg-emerald-400" : "bg-gradient-to-r from-amber-400 to-amber-300"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Create Task */}
          <div className="fade-up mb-10" style={{ animationDelay: "0.1s" }}>
            <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-3">
                Add Task
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input-glow flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/15 text-sm outline-none focus:border-amber-500/50 transition-all duration-200"
                />
                <button
                  onClick={createTask}
                  disabled={creating || !title.trim()}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-black text-sm font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 active:scale-95 whitespace-nowrap"
                >
                  {creating ? "Adding…" : "+ Add"}
                </button>
              </div>
            </div>
          </div>

          {/* Tasks Display */}
          {loading ? (
            <div className="grid md:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#0f1117] border border-white/[0.06] rounded-2xl p-5 h-40 animate-pulse" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-3xl">
                ✅
              </div>
              <p className="text-white/20 text-sm">No tasks yet. Add one above.</p>
            </div>
          ) : view === "kanban" ? (
            <div className="fade-up grid md:grid-cols-3 gap-6" style={{ animationDelay: "0.2s" }}>
              {ALL_STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={tasksByStatus[status]}
                  onDelete={deleteTask}
                  onStatusChange={updateStatus}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="fade-up flex flex-col gap-3" style={{ animationDelay: "0.2s" }}>
              {tasks.map((task) => (
                <div key={task.id} className="fade-up">
                  <TaskCard task={task} onDelete={deleteTask} onStatusChange={updateStatus} />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}

export default Tasks

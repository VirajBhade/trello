import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Layout from "../components/Layout"

function Tasks() {

  const { projectId } = useParams()

  const [taskTitle, setTaskTitle] = useState("")
  const [tasks, setTasks] = useState([])

  const token = localStorage.getItem("token")

  const fetchTasks = async () => {

    try {

      const response = await axios.get(
        `http://127.0.0.1:8000/tasks/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTasks(response.data)

    } catch (error) {

      console.log(error)

    }

  }

  const createTask = async () => {

    try {

      await axios.post(
        "http://127.0.0.1:8000/tasks/",
        {
          title: taskTitle,
          project_id: Number(projectId)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTaskTitle("")

      fetchTasks()

    } catch (error) {

      console.log(error)

    }

  }

  const updateStatus = async (taskId, status) => {

    try {

      await axios.patch(
        `http://127.0.0.1:8000/tasks/${taskId}/status?new_status=${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchTasks()

    } catch (error) {

      console.log(error)

    }

  }

  const deleteTask = async (taskId) => {

    try {

      await axios.delete(
        `http://127.0.0.1:8000/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchTasks()

    } catch (error) {

      console.log(error)

    }

  }

  useEffect(() => {

    fetchTasks()

  }, [])

  return (

    <Layout>

      <div className="min-h-screen bg-slate-950 text-white p-10">

        <div className="max-w-7xl mx-auto">

          <div className="mb-12">

            <h1 className="text-6xl font-extrabold text-green-500 mb-4">
              Task Board
            </h1>

            <p className="text-gray-400 text-xl">
              Track and manage all your tasks
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-12 shadow-xl">

            <div className="flex gap-4">

              <input
                type="text"
                placeholder="Enter Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none text-white placeholder-gray-400"
              />

              <button
                onClick={createTask}
                className="bg-green-500 hover:bg-green-600 transition duration-300 px-8 py-4 rounded-2xl font-semibold"
              >
                Create Task
              </button>

            </div>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* TODO */}

            <div className="bg-slate-900 border border-red-500 rounded-3xl p-6">

              <h2 className="text-3xl font-bold text-red-400 mb-6">
                Todo
              </h2>

              <div className="space-y-5">

                {
                  tasks
                    .filter(task => task.status === "todo")
                    .map(task => (

                      <div
                        key={task.id}
                        className="bg-slate-800 p-5 rounded-2xl border border-slate-700"
                      >

                        <h3 className="text-2xl font-bold mb-5">
                          {task.title}
                        </h3>

                        <div className="flex flex-wrap gap-3">

                          <button
                            onClick={() => updateStatus(task.id, "in_progress")}
                            className="bg-yellow-500 hover:bg-yellow-600 transition px-4 py-2 rounded-xl"
                          >
                            Progress
                          </button>

                          <button
                            onClick={() => updateStatus(task.id, "done")}
                            className="bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded-xl"
                          >
                            Done
                          </button>

                          <button
                            onClick={() => deleteTask(task.id)}
                            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-xl"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    ))
                }

              </div>

            </div>

            {/* IN PROGRESS */}

            <div className="bg-slate-900 border border-yellow-500 rounded-3xl p-6">

              <h2 className="text-3xl font-bold text-yellow-400 mb-6">
                In Progress
              </h2>

              <div className="space-y-5">

                {
                  tasks
                    .filter(task => task.status === "in_progress")
                    .map(task => (

                      <div
                        key={task.id}
                        className="bg-slate-800 p-5 rounded-2xl border border-slate-700"
                      >

                        <h3 className="text-2xl font-bold mb-5">
                          {task.title}
                        </h3>

                        <div className="flex flex-wrap gap-3">

                          <button
                            onClick={() => updateStatus(task.id, "todo")}
                            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-xl"
                          >
                            Todo
                          </button>

                          <button
                            onClick={() => updateStatus(task.id, "done")}
                            className="bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded-xl"
                          >
                            Done
                          </button>

                          <button
                            onClick={() => deleteTask(task.id)}
                            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-xl"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    ))
                }

              </div>

            </div>

            {/* DONE */}

            <div className="bg-slate-900 border border-green-500 rounded-3xl p-6">

              <h2 className="text-3xl font-bold text-green-400 mb-6">
                Done
              </h2>

              <div className="space-y-5">

                {
                  tasks
                    .filter(task => task.status === "done")
                    .map(task => (

                      <div
                        key={task.id}
                        className="bg-slate-800 p-5 rounded-2xl border border-slate-700"
                      >

                        <h3 className="text-2xl font-bold mb-5">
                          {task.title}
                        </h3>

                        <div className="flex flex-wrap gap-3">

                          <button
                            onClick={() => updateStatus(task.id, "todo")}
                            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-xl"
                          >
                            Todo
                          </button>

                          <button
                            onClick={() => updateStatus(task.id, "in_progress")}
                            className="bg-yellow-500 hover:bg-yellow-600 transition px-4 py-2 rounded-xl"
                          >
                            Progress
                          </button>

                          <button
                            onClick={() => deleteTask(task.id)}
                            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-xl"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    ))
                }

              </div>

            </div>

          </div>

        </div>

      </div>

    </Layout>

  )

}

export default Tasks
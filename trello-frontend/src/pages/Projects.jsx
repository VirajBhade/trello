import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import Layout from "../components/Layout"

function Projects() {

  const { teamId } = useParams()

  const [projectName, setProjectName] = useState("")
  const [projects, setProjects] = useState([])

  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  const fetchProjects = async () => {

    try {

      const response = await axios.get(
        `http://127.0.0.1:8000/projects/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setProjects(response.data)

    } catch (error) {

      console.log(error)

    }

  }

  const createProject = async () => {

    try {

      await axios.post(
        "http://127.0.0.1:8000/projects/",
        {
          name: projectName,
          team_id: Number(teamId)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setProjectName("")

      fetchProjects()

    } catch (error) {

      console.log(error)

      alert("Error creating project")

    }

  }

  useEffect(() => {

    fetchProjects()

  }, [])

  return (

    <Layout>

      <div className="min-h-screen bg-slate-950 text-white p-10">

        <div className="max-w-6xl mx-auto">

          <div className="mb-12">

            <h1 className="text-6xl font-extrabold text-purple-500 mb-4">
              Projects
            </h1>

            <p className="text-gray-400 text-xl">
              Organize and manage project workflows
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-12 shadow-xl">

            <h2 className="text-3xl font-bold mb-6">
              Create New Project
            </h2>

            <div className="flex gap-4">

              <input
                type="text"
                placeholder="Enter Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none text-white placeholder-gray-400"
              />

              <button
                onClick={createProject}
                className="bg-purple-500 hover:bg-purple-600 transition duration-300 px-8 py-4 rounded-2xl font-semibold"
              >
                Create Project
              </button>

            </div>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {
              projects.map((project) => (

                <div
                  key={project.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl hover:scale-105 hover:border-purple-500 transition duration-300"
                >

                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-3xl font-bold mb-5">
                    {project.name.charAt(0).toUpperCase()}
                  </div>

                  <h2 className="text-3xl font-bold mb-3">
                    {project.name}
                  </h2>

                  <p className="text-gray-400 mb-6">
                    Project management workspace
                  </p>

                  <button
                    onClick={() => navigate(`/tasks/${project.id}`)}
                    className="w-full bg-purple-500 hover:bg-purple-600 transition duration-300 py-4 rounded-2xl font-semibold"
                  >
                    Open Tasks
                  </button>

                </div>

              ))
            }

          </div>

        </div>

      </div>

    </Layout>

  )

}

export default Projects
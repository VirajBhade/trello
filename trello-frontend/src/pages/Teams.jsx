import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Layout from "../components/Layout"

function Teams() {

  const [teamName, setTeamName] = useState("")
  const [teams, setTeams] = useState([])

  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  const fetchTeams = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/teams/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTeams(response.data)

    } catch (error) {

      console.log(error)

    }

  }

  const createTeam = async () => {

    try {

      await axios.post(
        "http://127.0.0.1:8000/teams/",
        {
          name: teamName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTeamName("")

      fetchTeams()

    } catch (error) {

      console.log(error)

      alert("Error creating team")

    }

  }

  useEffect(() => {

    fetchTeams()

  }, [])

  return (

    <Layout>

      <div className="min-h-screen bg-slate-950 text-white p-10">

        <div className="max-w-6xl mx-auto">

          {/* HEADER */}

          <div className="mb-12">

            <h1 className="text-6xl font-extrabold text-blue-500 mb-4">
              Team Workspace
            </h1>

            <p className="text-gray-400 text-xl">
              Manage your teams professionally
            </p>

          </div>

          {/* CREATE TEAM */}

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-12 shadow-xl">

            <h2 className="text-3xl font-bold mb-6">
              Create New Team
            </h2>

            <div className="flex gap-4">

              <input
                type="text"
                placeholder="Enter Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none text-white placeholder-gray-400"
              />

              <button
                onClick={createTeam}
                className="bg-blue-500 hover:bg-blue-600 transition duration-300 px-8 py-4 rounded-2xl font-semibold"
              >
                Create Team
              </button>

            </div>

          </div>

          {/* TEAM CARDS */}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {
              teams.map((team) => (

                <div
                  key={team.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl hover:scale-105 hover:border-blue-500 transition duration-300"
                >

                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-3xl font-bold mb-5">
                    {team.name.charAt(0).toUpperCase()}
                  </div>

                  <h2 className="text-3xl font-bold mb-3">
                    {team.name}
                  </h2>

                  <p className="text-gray-400 mb-6">
                    Team collaboration workspace
                  </p>

                  <button
                    onClick={() => navigate(`/projects/${team.id}`)}
                    className="w-full bg-blue-500 hover:bg-blue-600 transition duration-300 py-4 rounded-2xl font-semibold"
                  >
                    Open Projects
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

export default Teams
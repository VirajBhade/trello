import { Link } from "react-router-dom"

function Layout({ children }) {

  return (

    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}

      <div className="w-72 bg-slate-900 border-r border-slate-800 p-6">

        <h1 className="text-3xl font-extrabold text-blue-500 mb-10">
          Trello Clone
        </h1>

        <nav className="flex flex-col gap-4">

          <Link
            to="/teams"
            className="bg-slate-800 hover:bg-slate-700 transition p-4 rounded-2xl text-lg font-semibold"
          >
            Teams
          </Link>

          <Link
            to="/projects"
            className="bg-slate-800 hover:bg-slate-700 transition p-4 rounded-2xl text-lg font-semibold"
          >
            Projects
          </Link>

        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token")
            window.location.href = "/"
          }}
          className="mt-10 w-full bg-red-500 hover:bg-red-600 transition p-4 rounded-2xl text-lg font-semibold"
        >
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1">

        {/* NAVBAR */}

        <div className="bg-slate-900 border-b border-slate-800 px-10 py-6 flex items-center justify-between">

          <h2 className="text-3xl font-bold">
            Dashboard
          </h2>

          <div className="bg-blue-500 px-5 py-2 rounded-xl font-semibold">
            Welcome
          </div>

        </div>

        {/* PAGE CONTENT */}

        <div className="p-10">

          {children}

        </div>

      </div>

    </div>

  )

}

export default Layout
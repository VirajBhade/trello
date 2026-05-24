import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/login"
import Register from "./pages/Register"
import Teams from "./pages/Teams"
import Projects from "./pages/Projects"
import Tasks from "./pages/Tasks"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/teams" element={<Teams />} />

        <Route path="/projects/:teamId" element={<Projects />} />

        <Route path="/tasks/:projectId" element={<Tasks />} />

      </Routes>

    </BrowserRouter>

  )

}

export default App
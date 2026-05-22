import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Teams from "./pages/Teams"
import Projects from "./pages/Projects"
import Tasks from "./pages/Tasks"

import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

      

        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:teamId"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/:projectId"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  )

}

export default App
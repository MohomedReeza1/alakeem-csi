import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import { Toaster } from "react-hot-toast"
import Login from './pages/Login'
import FeedbackForm from './pages/FeedbackForm'
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
    <Toaster position="top-center" />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/feedback" element={<FeedbackForm />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
    </>
  )
}

export default App

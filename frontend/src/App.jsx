import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import { Toaster } from "react-hot-toast"
import Login from './pages/Login'
import FeedbackForm from './pages/FeedbackForm'
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";

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
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
    
    </>
  )
}

export default App

import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import { Toaster } from "react-hot-toast"
import Login from './pages/Login'
import FeedbackForm from './pages/FeedbackForm'
import Dashboard from "./pages/Dashboard";
import Analyticss from "./pages/Analyticss";
import DashboardStatistics from "./pages/DashboardStatistics";
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<FeedbackForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/analytics" element={<PrivateRoute><Analyticss /></PrivateRoute>} />
        <Route path="/dashboard/statistics" element={<PrivateRoute><DashboardStatistics /></PrivateRoute>} />
      </Routes>
      <Analytics />
      <SpeedInsights/>
    </>
  )
}

export default App

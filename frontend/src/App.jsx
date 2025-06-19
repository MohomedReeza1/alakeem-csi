import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import { Toaster } from "react-hot-toast"
import Login from './pages/Login'
import FeedbackForm from './pages/FeedbackForm'

function App() {
  return (
    <>
    <Toaster position="top-center" />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/feedback" element={<FeedbackForm />} />
    </Routes>
    </>
  )
}

export default App

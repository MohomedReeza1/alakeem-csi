import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth()

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>
  }

  if (!token) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PrivateRoute
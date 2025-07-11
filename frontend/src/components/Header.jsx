import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/Al Akeem Logo.png';

export default function Header() {
  const { logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleTogglePage = () => {
    if (location.pathname === '/dashboard') {
      navigate('/analytics');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-indigo-600 py-4 px-6 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Al Akeem Logo"
          className="w-10 h-10 rounded-full bg-white p-1"
        />
        <h1 className="text-white text-lg font-semibold">
          CSI Admin Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleTogglePage}
          className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded"
        >
          {location.pathname === '/dashboard' ? 'Analytics' : 'Dashboard'}
        </button>
        <p className="text-white text-sm">
          Logged in as:{' '}
          <span className="font-bold capitalize">
            {role ? role : 'admin'}
          </span>
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
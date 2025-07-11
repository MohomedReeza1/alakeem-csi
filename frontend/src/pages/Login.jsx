import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios'; // keep for later backend integration
import logo from '../assets/Logo.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, token, role } = useAuth();

  useEffect(() => {
    if (token && role === 'admin') {
      navigate('/dashboard');
    }
  }, [token, role]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // ✅ TEMP: Simulate API call with hardcoded check
      if (username === 'admin' && password === 'password') {
        const dummyToken = 'dummy-jwt-token';
        const dummyRole = 'admin';

        localStorage.setItem('token', dummyToken);
        localStorage.setItem('role', dummyRole);
        login(dummyToken, dummyRole);
        return;
      }

      setError('Invalid credentials');

      // 🔒 REAL API CALL (Enable after backend is ready)
      /*
      const res = await api.post('/auth/login', { username, password });
      const { access_token, role } = res.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      login(access_token, role);
      */

    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md text-center"
      >
        <img src={logo} alt="Al Akeem Logo" className="mx-auto mb-6 w-40" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign In</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition duration-200"
        >
          SIGN IN
        </button>
      </form>
    </div>
  );
}

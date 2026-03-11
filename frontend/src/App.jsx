import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import BrowsePage from './pages/BrowsePage.jsx';
import BusinessPage from './pages/BusinessPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

axios.defaults.baseURL = 'http://localhost:3000';


function Navbar() {
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');
  const logout = () => { localStorage.clear(); window.location.href = '/'; };
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between font-mono">
      <Link to="/" className="font-bold text-gray-800">📂 CrowdSourced Business Reviews</Link>
      <div className="flex items-center gap-6 text-sm">
        {role && (
          <span className="text-gray-400">
            Logged in as <span className="font-semibold text-gray-700">{name || role}</span>
            {role === 'admin' && ' (admin)'}
          </span>
        )}
        <div className="flex gap-4">
          <Link to="/" className="text-gray-500 hover:text-gray-800">Browse</Link>
          {role === 'admin' && <Link to="/admin" className="text-gray-500 hover:text-gray-800">Admin</Link>}
          {localStorage.getItem('token')
            ? <button onClick={logout} className="text-gray-500 hover:text-gray-800">Logout</button>
            : <Link to="/login" className="text-gray-500 hover:text-gray-800">Login</Link>
          }
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const role = localStorage.getItem('role');
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-mono">
        <Navbar />
        <Routes>
          <Route path="/" element={<BrowsePage />} />
          <Route path="/business/:id" element={<BusinessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
                role === 'admin' ? <AdminPage /> : <Navigate to="/login" />
              }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, PlusCircle, Sparkles } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/40 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mr-3 shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                <Sparkles size={20} />
              </div>
              <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">SmartComplain</span>
            </Link>
            {token && (
              <div className="hidden sm:ml-10 sm:flex sm:space-x-2">
                <Link 
                  to="/dashboard" 
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive('/dashboard') 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
                      : 'text-gray-600 hover:bg-white/60 hover:text-indigo-600'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link 
                  to="/create-complaint" 
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive('/create-complaint') 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
                      : 'text-gray-600 hover:bg-white/60 hover:text-indigo-600'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Complaint
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {token ? (
              <div className="flex items-center space-x-5">
                <div className="hidden sm:flex items-center space-x-2 bg-white/50 px-3 py-1.5 rounded-full border border-white/60 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all transform hover:-translate-y-0.5"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="text-gray-600 hover:bg-white/60 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                  Login
                </Link>
                <Link to="/signup" className="text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5">
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

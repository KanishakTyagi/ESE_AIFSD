import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="glass-card max-w-md w-full rounded-3xl p-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 opacity-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 opacity-20 blur-2xl"></div>

        <div className="relative text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-6 shadow-xl shadow-indigo-500/30 animate-float">
            <LogIn size={36} strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-3 text-lg">Sign in to manage your complaints</p>
        </div>
        
        <form onSubmit={handleLogin} className="relative space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="block w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="block w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="group w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:transform-none"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
        
        <div className="mt-8 text-center relative">
          <p className="text-sm text-gray-600 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-bold hover:from-indigo-500 hover:to-purple-500 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

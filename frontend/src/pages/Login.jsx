import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 mb-3 border border-teal-500/20 text-2xl">
            ⚡
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Welcome!</h2>
          <p className="text-slate-400 text-sm mt-1">Sign in to manage your tasks</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3.5 rounded-xl text-center mb-5 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-semibold py-3 rounded-xl shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all duration-150 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in... ⏳' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-400 hover:text-teal-300 font-medium hover:underline transition-all">
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
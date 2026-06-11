import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const result = await registerUser(name, email, password);
    setLoading(false);

    if (result.success) {
      setSuccessMsg('Registration successful! Please login... 🎉');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 mb-3 border border-teal-500/20 text-2xl">
            ✨
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Create an account</h2>
          <p className="text-slate-400 text-sm mt-1">Start your AI Task Manager journey for free</p>
        </div>

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-3.5 rounded-xl text-center mb-5">
            {successMsg}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3.5 rounded-xl text-center mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-slate-600"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-slate-600"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-slate-600"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-semibold py-3 rounded-xl shadow-lg active:scale-[0.98] transition-all mt-2 disabled:opacity-50"
          >
            {loading ? 'Creating account... ⏳' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium hover:underline transition-all">
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand Logo ⚡ */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-bold text-white tracking-wider">AI Task Manager</span>
        </div>

        {/* User Info and Logout Button */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-slate-300 text-sm font-medium">✨ {user?.user?.name || 'User'}</p>
            <p className="text-slate-500 text-xs">{user?.user?.email}</p>
          </div>
          
          <button
            onClick={logout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
          >
            Log Out 🚪
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeClassName = "bg-gray-900 text-white";
  const inactiveClassName = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <div className="min-h-screen">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-0">
                <span className="text-xl font-bold text-white">SlotSwapper</span>
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `${isActive ? activeClassName : inactiveClassName} rounded-md px-3 py-2 text-sm font-medium`
                  }
                >
                  My Dashboard
                </NavLink>
                <NavLink
                  to="/marketplace"
                  className={({ isActive }) =>
                    `${isActive ? activeClassName : inactiveClassName} rounded-md px-3 py-2 text-sm font-medium`
                  }
                >
                  Marketplace
                </NavLink>
                <NavLink
                  to="/requests"
                  className={({ isActive }) =>
                    `${isActive ? activeClassName : inactiveClassName} rounded-md px-3 py-2 text-sm font-medium`
                  }
                >
                  My Requests
                </NavLink>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 mr-4">Welcome, {user?.name}!</span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
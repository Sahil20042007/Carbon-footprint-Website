// Step 1: Create a DarkModeContext (src/context/DarkModeContext.jsx)

import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  // Get initial dark mode from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update localStorage and apply class to <html> whenever dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};


// Step 2: Update App.js to wrap with DarkModeProvider

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Calculator from './pages/Calculator';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import Offset from './pages/Offset';
import Community from './pages/Community';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DarkModeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/offset" element={<Offset />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        </DarkModeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;


// Step 3: Update Navbar with proper dark mode toggle

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { Sun, Moon, Menu, X, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌍</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                EcoTrack
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/calculator"
                  className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2"
                >
                  Calculator
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2"
                >
                  Dashboard
                </Link>
                <Link
                  to="/recommendations"
                  className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2"
                >
                  Recommendations
                </Link>
                <Link
                  to="/offset"
                  className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2"
                >
                  Offset
                </Link>
                <Link
                  to="/community"
                  className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2"
                >
                  Community
                </Link>

                <div className="flex items-center space-x-2 pl-4 border-l dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300 flex items-center">
                    <User size={18} className="mr-1" />
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                >
                  Register
                </Link>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {user ? (
              <>
                <Link
                  to="/calculator"
                  className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Calculator
                </Link>
                <Link
                  to="/dashboard"
                  className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/recommendations"
                  className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Recommendations
                </Link>
                <Link
                  to="/offset"
                  className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Offset
                </Link>
                <Link
                  to="/community"
                  className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Community
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


// Step 4: Update tailwind.config.js to enable dark mode

module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


// Step 5: Common component styling patterns for dark mode

/*
STYLING PATTERN GUIDE:

Background colors:
- bg-white dark:bg-gray-800
- bg-gray-50 dark:bg-gray-900
- bg-gray-100 dark:bg-gray-800

Text colors:
- text-gray-900 dark:text-white
- text-gray-700 dark:text-gray-300
- text-gray-600 dark:text-gray-400

Borders:
- border-gray-200 dark:border-gray-700
- border-gray-300 dark:border-gray-600

Inputs:
- bg-gray-50 dark:bg-gray-700
- border-gray-300 dark:border-gray-600
- text-gray-900 dark:text-white

Cards:
- bg-white dark:bg-gray-800
- border border-gray-200 dark:border-gray-700
- shadow-md dark:shadow-gray-900/50

Buttons:
- bg-green-600 dark:bg-green-500
- hover:bg-green-700 dark:hover:bg-green-600
- text-white (stays same)

Always add transition-colors for smooth changes:
- transition-colors duration-300
*/
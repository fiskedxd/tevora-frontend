import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogIn, UserPlus, Package } from 'lucide-react';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Accueil', icon: <Package size={16} /> },
    { to: '/discover', label: 'Explorer', icon: <Package size={16} /> },
    { to: '/music', label: 'Musiques', icon: <Package size={16} /> },
    { to: '/playlists', label: 'Playlists', icon: <Package size={16} /> },
    { to: '/login', label: 'Connexion', icon: <LogIn size={16} /> },
    { to: '/register', label: 'Inscription', icon: <UserPlus size={16} /> },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'border-b border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl' 
          : 'bg-black/50 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 blur transition duration-500 group-hover:opacity-100" />
            <div className="relative rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-2">
              <Package size={20} className="text-white" />
            </div>
          </motion.div>
          <span className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            Tavora
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="relative z-50 rounded-full p-2 text-white/70 transition hover:text-white hover:bg-white/5 md:hidden"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-white/10 bg-black/95 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
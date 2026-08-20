import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Bot,
  MapPin,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  ChevronRight,
  User,
  BookOpen,
  CreditCard,
  FileText,
  Award,
  Search,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/chat', label: 'AI Navigator', icon: Bot, highlight: true },
  { path: '/about', label: 'About Campus', icon: MapPin },
  { path: '/lms', label: 'LMS', icon: Award },
  { path: '/fees', label: 'Fees', icon: CreditCard },
  { path: '/papers', label: 'Papers', icon: FileText },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/lost-found', label: 'Lost & Found', icon: Search },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, userRole, userProfile, logout, isDemo } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User';
  const roleBadge = userRole === 'admin' ? 'badge-danger' : userRole === 'faculty' ? 'badge-purple' : 'badge-info';

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-bold text-base gradient-text">CampusBuddy</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-72 glass border-r border-white/5 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg gradient-text">CampusBuddy</h1>
              <p className="text-[0.65rem] text-slate-500 tracking-wider uppercase">AI Assistant</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/15 to-secondary/10 text-white border border-primary/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                } ${item.highlight ? 'relative' : ''}`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.highlight && (
                <span className="px-1.5 py-0.5 rounded-md text-[0.6rem] font-bold bg-gradient-to-r from-primary to-secondary text-white">
                  AI
                </span>
              )}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5">
          {isDemo && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20 text-warning text-[0.65rem]">
              ⚡ Demo Mode — No Firebase
            </div>
          )}
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors group"
          >
            {userProfile?.photoURL ? (
              <img 
                src={userProfile.photoURL} 
                alt={displayName} 
                className="w-9 h-9 rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-sm font-bold border border-white/5">
                {displayName[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{displayName}</p>
              <span className={`badge ${roleBadge} text-[0.6rem]`}>{userRole}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-primary' : 'text-slate-500'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[0.6rem] font-medium">{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}

import React, { useContext, useState, useRef, useEffect } from 'react';
import { ESGDataContext } from '../context/ESGDataContext';
import { authService } from '../services/authService';
import { 
  LayoutDashboard, 
  Leaf, 
  Users, 
  ShieldCheck, 
  Trophy, 
  FileSpreadsheet, 
  Settings as SettingsIcon,
  Bell,
  Sparkles,
  LogOut
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  const { activeUser, notifications, usersList, switchUser } = useContext(ESGDataContext);
  const [showNotif, setShowNotif] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setCurrentView('landing');
    } catch (err) {
      alert(`Sign Out Failed: ${err.message || err}`);
    }
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, class: 'dashboard' },
    { id: 'environmental', name: 'Environmental', icon: Leaf, class: 'environmental' },
    { id: 'social', name: 'Social', icon: Users, class: 'social' },
    { id: 'governance', name: 'Governance', icon: ShieldCheck, class: 'governance' },
    { id: 'gamification', name: 'Gamification', icon: Trophy, class: 'gamification' },
    { id: 'reports', name: 'Reports', icon: FileSpreadsheet, class: 'reports' },
    { id: 'settings', name: 'Settings', icon: SettingsIcon, class: 'settings' },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate User Level based on XP (every 1000 XP = 1 Level)
  const userLevel = Math.floor(activeUser.xp / 1000) + 1;

  return (
    <aside className="sidebar">
      <div className="brand-section" onClick={() => setCurrentView('landing')} style={{ cursor: 'pointer' }} title="Go back to Landing Page">
        <Sparkles size={24} color="#2ecc71" />
        <div className="brand-name">Eco<span>Sphere</span></div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${item.class} ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <span className="nav-item-icon"><IconComponent size={18} /></span>
              <span>{item.name}</span>
            </div>
          );
        })}
      </nav>

      {/* Notifications Panel in Sidebar */}
      <div className="notification-bell-container" ref={dropdownRef}>
        <button className="notif-bell-btn" onClick={() => setShowNotif(!showNotif)}>
          <Bell size={16} />
          <span>Notifications</span>
          {notifications.length > 0 && (
            <span className="bell-badge">{notifications.length}</span>
          )}
        </button>

        {showNotif && (
          <div className="notif-dropdown">
            <div className="notif-dropdown-header">
              <span>Alert Logs</span>
              <button 
                onClick={() => setShowNotif(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem' }}
              >
                Close
              </button>
            </div>
            <div className="notif-list">
              {notifications.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  No recent alerts.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="notif-item">
                    {notif.message}
                    <span>{notif.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Active User Dashboard Panel */}
      <div className="user-panel">
        <div className="user-header">
          <div className="user-avatar">
            {activeUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="user-info">
            <div className="user-name">{activeUser.name}</div>
            <div className="user-dept">{activeUser.department} Dept</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            <span>Level {userLevel}</span>
            <span>{activeUser.xp % 1000} / 1000 XP</span>
          </div>
          <div className="progress-track" style={{ height: '4px' }}>
            <div 
              className="progress-bar" 
              style={{ 
                width: `${(activeUser.xp % 1000) / 10}%`,
                background: 'var(--color-accent)'
              }}
            ></div>
          </div>
        </div>

        <div className="user-stats">
          <div className="stat-item">
            XP: <span>{activeUser.xp}</span>
          </div>
          <div className="stat-item points">
            PTS: <span>{activeUser.points}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', marginTop: '4px' }}>
          <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Profile Switcher</label>
          <select 
            value={activeUser.id} 
            onChange={(e) => switchUser(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '4px 6px',
              color: '#fff',
              fontSize: '0.72rem',
              outline: 'none',
              cursor: 'pointer',
              width: '100%',
              fontFamily: 'var(--font-family)'
            }}
          >
            {(() => {
              const list = [...(usersList || [])];
              if (!list.some(u => u.id === 'virtual-employee-1')) {
                list.push({ id: 'virtual-employee-1', name: 'Karan Shah', role: 'Employee' });
              }
              if (!list.some(u => u.id === 'virtual-manager-1')) {
                list.push({ id: 'virtual-manager-1', name: 'S. Nair', role: 'Manager' });
              }
              return list.map(u => (
                <option key={u.id} value={u.id} style={{ background: '#0c0f0d', color: '#fff' }}>
                  {u.name} ({u.role})
                </option>
              ));
            })()}
          </select>
        </div>

        <button 
          onClick={handleSignOut}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', marginTop: '8px', gap: '6px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <LogOut size={12} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

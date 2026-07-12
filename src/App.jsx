import React, { useState, useContext } from 'react';
import { ESGDataProvider, ESGDataContext } from './context/ESGDataContext';
import Sidebar from './components/Sidebar';
import Landing from './views/Landing';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Environmental from './views/Environmental';
import Social from './views/Social';
import Governance from './views/Governance';
import Gamification from './views/Gamification';
import Reports from './views/Reports';
import Settings from './views/Settings';
import './Landing.css';

function AppContent() {
  const { activeUser, loading } = useContext(ESGDataContext);
  const [currentView, setCurrentView] = useState('landing'); // Default landing page

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} />;
      case 'environmental':
        return <Environmental />;
      case 'social':
        return <Social />;
      case 'governance':
        return <Governance />;
      case 'gamification':
        return <Gamification />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  if (loading) {
    return (
      <div className="landing-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div className="progress-bar-container" style={{ width: '120px' }}>
            <div className="progress-track" style={{ height: '6px' }}>
              <div className="progress-bar" style={{ width: '100%', animation: 'floatEffect 2s infinite' }}></div>
            </div>
          </div>
          <span>Synchronizing EcoSphere Database...</span>
        </div>
      </div>
    );
  }

  // Render Landing view first
  if (currentView === 'landing') {
    return (
      <Landing 
        onLaunch={() => {
          if (activeUser) {
            setCurrentView('dashboard');
          } else {
            setCurrentView('login');
          }
        }} 
      />
    );
  }

  // Render Login view if user is not authenticated on Supabase
  if (!activeUser) {
    return <Login onLoginSuccess={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ESGDataProvider>
      <AppContent />
    </ESGDataProvider>
  );
}

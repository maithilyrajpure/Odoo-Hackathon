import React, { useState } from 'react';
import { ESGDataProvider } from './context/ESGDataContext';
import Sidebar from './components/Sidebar';
import Landing from './views/Landing';
import Dashboard from './views/Dashboard';
import Environmental from './views/Environmental';
import Social from './views/Social';
import Governance from './views/Governance';
import Gamification from './views/Gamification';
import Reports from './views/Reports';
import Settings from './views/Settings';
import './Landing.css';

function AppContent() {
  const [currentView, setCurrentView] = useState('landing'); // Default view is the premium landing page

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

  if (currentView === 'landing') {
    return <Landing onLaunch={() => setCurrentView('dashboard')} />;
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

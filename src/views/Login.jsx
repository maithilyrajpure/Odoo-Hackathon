import React, { useState, useContext } from 'react';
import { authService } from '../services/authService';
import { ESGDataContext } from '../context/ESGDataContext';
import { Sparkles, Mail, Lock, Building, User, LogIn, UserPlus } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const { user, profile } = await authService.signIn(email, password);
      onLoginSuccess(profile);
    } catch (err) {
      alert(`Sign In Failed: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !orgName) return;
    setLoading(true);
    try {
      const { user, profile } = await authService.signUp(email, password, name, orgName);
      alert("Registration Successful! Welcome to EcoSphere.");
      onLoginSuccess(profile);
    } catch (err) {
      alert(`Registration Failed: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-on-scroll visible" style={{ width: '100%', maxWidth: '420px', padding: '16px' }}>
        <div className="hero-glass-panel" style={{ padding: '40px 32px', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={24} color="var(--color-env)" />
              <span className="brand-name" style={{ fontSize: '1.4rem' }}>Eco<span>Sphere</span></span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Direct ESG & Gamification Platform
            </p>
          </div>

          {/* Tab switcher */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '10px' }}>
            <button 
              className={`tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
              style={{ flex: 1, paddingBottom: '12px' }}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </button>
            <button 
              className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
              style={{ flex: 1, paddingBottom: '12px' }}
              onClick={() => setActiveTab('signup')}
            >
              Register Org
            </button>
          </div>

          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    className="form-input" 
                    style={{ paddingLeft: '38px', width: '100%' }}
                    placeholder="name@company.com" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="password" 
                    className="form-input" 
                    style={{ paddingLeft: '38px', width: '100%' }}
                    placeholder="••••••••" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
                {loading ? 'Authenticating...' : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><LogIn size={16} /> Sign In</span>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Organization Name</label>
                <div style={{ position: 'relative' }}>
                  <Building size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '38px', width: '100%' }}
                    placeholder="Acme Corp" 
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Your Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '38px', width: '100%' }}
                    placeholder="Aditi Rao" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Work Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    className="form-input" 
                    style={{ paddingLeft: '38px', width: '100%' }}
                    placeholder="name@company.com" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="password" 
                    className="form-input" 
                    style={{ paddingLeft: '38px', width: '100%' }}
                    placeholder="•••••••• (Min 6 chars)" 
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
                {loading ? 'Creating Account...' : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><UserPlus size={16} /> Register Organization</span>}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

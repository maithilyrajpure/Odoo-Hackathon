import React, { useContext, useState } from 'react';
import { ESGDataContext } from '../context/ESGDataContext';
import { Trophy, Gift, Badge, Users, Star, Plus, Check, Play, Settings } from 'lucide-react';

export default function Gamification() {
  const {
    challenges,
    challengeParticipations,
    badges,
    rewards,
    activeUser,
    employeeParticipations,
    joinChallenge,
    submitChallengeProgress,
    approveChallengeParticipation,
    redeemReward,
    addChallenge,
    setChallenges
  } = useContext(ESGDataContext);

  const [activeSubTab, setActiveSubTab] = useState('challenges'); // Default matches excalidraw: Challenges

  // Form modals visibility
  const [showAddChallenge, setShowAddChallenge] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Form states
  const [challengeForm, setChallengeForm] = useState({ title: '', category: 'Carbon reduction', description: '', xp: '', difficulty: 'Medium', deadline: '' });
  const [progressForm, setProgressForm] = useState({ participationId: '', progress: '', proof: '' });

  // Custom Leaderboard calculation
  // Let's combine static seed leaderboard data with live user updates to make it feel extremely interactive and realistic
  const staticLeaderboard = [
    { rank: 1, name: 'Manufacturing Dept', code: 'MFC', xp: 4820, type: 'dept' },
    { rank: 2, name: 'Aditi Rao', code: 'EMP', xp: activeUser.xp, type: 'user' }, // Syncs dynamically with activeUser!
    { rank: 3, name: 'Karan Shah', code: 'EMP', xp: 3910, type: 'user' },
    { rank: 4, name: 'Corporate Dept', code: 'COF', xp: 3505, type: 'dept' },
    { rank: 5, name: 'Priya Sharma', code: 'EMP', xp: 3100, type: 'user' },
  ];

  // Sort dynamically
  const sortedLeaderboard = [...staticLeaderboard].sort((a, b) => b.xp - a.xp).map((item, idx) => ({
    ...item,
    rank: idx + 1
  }));

  const onSubmitChallenge = (e) => {
    e.preventDefault();
    if (!challengeForm.title || !challengeForm.xp || !challengeForm.deadline) return;
    const newChal = {
      id: String(Date.now()),
      title: challengeForm.title,
      category: challengeForm.category,
      description: challengeForm.description,
      xp: parseInt(challengeForm.xp),
      difficulty: challengeForm.difficulty,
      evidenceRequired: true,
      deadline: challengeForm.deadline,
      status: 'Active'
    };
    setChallenges(prev => [...prev, newChal]);
    setShowAddChallenge(false);
    setChallengeForm({ title: '', category: 'Carbon reduction', description: '', xp: '', difficulty: 'Medium', deadline: '' });
  };

  const onSubmitProgress = (e) => {
    e.preventDefault();
    if (!progressForm.participationId || !progressForm.progress) return;
    submitChallengeProgress(progressForm.participationId, progressForm.progress, progressForm.proof);
    setShowProgressModal(false);
    setProgressForm({ participationId: '', progress: '', proof: '' });
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-title-container">
          <h1>Gamification Center</h1>
          <p>Participate in team sustainability sprint challenges, unlock badges, and redeem points for rewards</p>
        </div>
      </div>

      {/* Tabs List */}
      <div className="tabs-container">
        <button 
          className={`tab-btn gamification ${activeSubTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('challenges')}
        >
          Challenges
        </button>
        <button 
          className={`tab-btn gamification ${activeSubTab === 'participation' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('participation')}
        >
          Challenge Participation
        </button>
        <button 
          className={`tab-btn gamification ${activeSubTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('badges')}
        >
          Badges
        </button>
        <button 
          className={`tab-btn gamification ${activeSubTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('rewards')}
        >
          Rewards
        </button>
        <button 
          className={`tab-btn gamification ${activeSubTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('leaderboard')}
        >
          Leaderboard
        </button>
      </div>

      {/* View: Challenges Grid */}
      {activeSubTab === 'challenges' && (
        <div>
          <div className="action-bar">
            <button className="btn btn-primary" onClick={() => setShowAddChallenge(true)}>
              <Plus size={16} /> New Challenge
            </button>
          </div>

          <div className="cards-grid">
            {challenges.map((c) => {
              const hasJoined = challengeParticipations.some(p => p.challengeTitle === c.title && p.employee === activeUser.name);
              return (
                <div key={c.id} className="info-card">
                  <div className="info-card-header">
                    <div className="info-card-title">
                      <Star size={18} color="var(--color-accent)" />
                      {c.title}
                    </div>
                    <span className={`badge-pill ${
                      c.status === 'Active' ? 'badge-approved' : 'badge-draft'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="info-card-desc">{c.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Difficulty: <strong style={{ color: '#fff' }}>{c.difficulty}</strong></span>
                    <span>Deadline: <strong style={{ color: '#fff' }}>{c.deadline}</strong></span>
                  </div>

                  <div className="info-card-meta">
                    <span style={{ fontWeight: '700', color: 'var(--color-accent)' }}>+{c.xp} XP / Points</span>
                    {c.status === 'Active' && (
                      <button 
                        className={`btn btn-sm ${hasJoined ? 'btn-secondary' : 'btn-accent'}`}
                        disabled={hasJoined}
                        onClick={() => joinChallenge(c.id)}
                      >
                        {hasJoined ? 'Joined' : 'Join Challenge'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View: Challenge Participation Ledger / Auditing queue */}
      {activeSubTab === 'participation' && (
        <div className="panel-card">
          <div className="action-bar">
            <button 
              className="btn btn-primary"
              onClick={() => {
                const userParts = challengeParticipations.filter(p => p.employee === activeUser.name && p.status === 'Joined');
                if (userParts.length > 0) {
                  setProgressForm(prev => ({ ...prev, participationId: userParts[0].id }));
                  setShowProgressModal(true);
                } else {
                  alert("No active challenges currently enrolled. Join a challenge first!");
                }
              }}
            >
              Update Progress
            </button>
          </div>
          
          <div className="table-container">
            <table className="esg-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Challenge Title</th>
                  <th>Progress</th>
                  <th>Proof File</th>
                  <th>Approval Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {challengeParticipations.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No challenge enrollments registered.</td>
                  </tr>
                ) : (
                  challengeParticipations.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: '600' }}>{p.employee}</td>
                      <td>{p.challengeTitle}</td>
                      <td>
                        <div className="progress-bar-container">
                          <div className="progress-track">
                            <div className="progress-bar" style={{ width: `${p.progress}%`, background: 'var(--color-accent)' }}></div>
                          </div>
                          <span className="progress-label">{p.progress}%</span>
                        </div>
                      </td>
                      <td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{p.proof}</td>
                      <td>
                        <span className={`badge-pill ${
                          p.status === 'Approved' ? 'badge-approved' : 
                          p.status === 'Under Review' ? 'badge-pending' : 'badge-draft'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        {p.status === 'Under Review' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn btn-primary btn-sm" 
                              onClick={() => approveChallengeParticipation(p.id, true)}
                              style={{ padding: '4px 8px', borderRadius: '4px' }}
                            >
                              Approve
                            </button>
                            <button 
                              className="btn btn-danger btn-sm" 
                              onClick={() => approveChallengeParticipation(p.id, false)}
                              style={{ padding: '4px 8px', borderRadius: '4px' }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.status === 'Approved' ? 'XP Awarded' : 'Ongoing'}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Badge Gallery */}
      {activeSubTab === 'badges' && (
        <div className="badges-container">
          {badges.map((b) => {
            const isUnlocked = activeUser.badges.includes(b.name);
            return (
              <div key={b.id} className={`badge-card ${isUnlocked ? '' : 'locked'}`}>
                <div className="badge-card-icon">
                  {b.icon}
                </div>
                <div className="badge-card-info">
                  <div className="badge-card-name">{b.name}</div>
                  <div className="badge-card-desc">{b.description}</div>
                  <span style={{ fontSize: '0.65rem', color: isUnlocked ? 'var(--color-env)' : 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginTop: '4px' }}>
                    {isUnlocked ? 'Unlocked' : `Rule: ${b.unlockRule}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View: Rewards Shop Catalog */}
      {activeSubTab === 'rewards' && (
        <div>
          <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Available Redeemable Point Balance:</span>
            <span style={{ fontStyle: 'normal', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.4rem', color: 'var(--color-accent)' }}>{activeUser.points} Points</span>
          </div>

          <div className="rewards-grid">
            {rewards.map((r) => (
              <div key={r.id} className="reward-card">
                <div className="reward-card-title">{r.name}</div>
                <p className="reward-card-desc">{r.description}</p>
                <div className="reward-card-price">
                  {r.pointsRequired} <span>Points</span>
                </div>
                <div className="reward-card-footer">
                  <span>Stock: {r.stock > 100 ? 'Unlimited' : `${r.stock} left`}</span>
                  <button 
                    className="btn btn-accent btn-sm"
                    disabled={r.stock <= 0 || activeUser.points < r.pointsRequired}
                    onClick={() => redeemReward(r.id)}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Leaderboard Rankings */}
      {activeSubTab === 'leaderboard' && (
        <div className="panel-card">
          <div className="table-container">
            <table className="esg-table">
              <thead>
                <tr>
                  <th>Global Rank</th>
                  <th>Employee / Department</th>
                  <th>Target Entity</th>
                  <th>Total Accumulated XP</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((item) => (
                  <tr key={item.name} style={item.name === activeUser.name ? { background: 'rgba(245, 158, 11, 0.05)' } : {}}>
                    <td style={{ fontWeight: '800', fontSize: '1.1rem', color: item.rank === 1 ? 'var(--color-accent)' : item.rank === 2 ? '#d1d5db' : '#b45309' }}>
                      #{item.rank}
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      {item.name} {item.name === activeUser.name ? ' (You)' : ''}
                    </td>
                    <td>
                      <span className={`badge-pill ${item.type === 'dept' ? 'badge-approved' : 'badge-joined'}`}>
                        {item.type === 'dept' ? 'Department' : 'Individual'}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--color-accent)' }}>{item.xp.toLocaleString()} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Define New Challenge */}
      {showAddChallenge && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Define Sustainability Challenge</h3>
              <button className="modal-close-btn" onClick={() => setShowAddChallenge(false)}>✕</button>
            </div>
            <form onSubmit={onSubmitChallenge}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>Challenge Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Energy Conservation Sprint"
                      required
                      value={challengeForm.title}
                      onChange={(e) => setChallengeForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Challenge Description</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Describe the rules and checklist of the challenge..."
                      value={challengeForm.description}
                      onChange={(e) => setChallengeForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
                    <div className="form-group">
                      <label>XP / Points Reward</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="e.g. 150"
                        required
                        value={challengeForm.xp}
                        onChange={(e) => setChallengeForm(prev => ({ ...prev, xp: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Difficulty Tier</label>
                      <select 
                        className="form-select"
                        value={challengeForm.difficulty}
                        onChange={(e) => setChallengeForm(prev => ({ ...prev, difficulty: e.target.value }))}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Challenge Expiry / Deadline</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      required
                      value={challengeForm.deadline}
                      onChange={(e) => setChallengeForm(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddChallenge(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Define Challenge</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log/Submit Challenge Progress */}
      {showProgressModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Submit Challenge Progress</h3>
              <button className="modal-close-btn" onClick={() => setShowProgressModal(false)}>✕</button>
            </div>
            <form onSubmit={onSubmitProgress}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>Enrolled Challenge Target</label>
                    <select 
                      className="form-select"
                      value={progressForm.participationId}
                      onChange={(e) => setProgressForm(prev => ({ ...prev, participationId: e.target.value }))}
                    >
                      {challengeParticipations
                        .filter(p => p.employee === activeUser.name && p.status === 'Joined')
                        .map(p => (
                          <option key={p.id} value={p.id}>{p.challengeTitle}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
                    <div className="form-group">
                      <label>Progress Completion (%)</label>
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        className="form-input" 
                        placeholder="e.g. 100"
                        required
                        value={progressForm.progress}
                        onChange={(e) => setProgressForm(prev => ({ ...prev, progress: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Proof Attachment File Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. energy_bill.jpg"
                        value={progressForm.proof}
                        onChange={(e) => setProgressForm(prev => ({ ...prev, proof: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProgressModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Progress</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

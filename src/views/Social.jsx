import React, { useContext, useState } from 'react';
import { ESGDataContext } from '../context/ESGDataContext';
import { Plus, Check, X, FileCheck2, UserPlus, Info } from 'lucide-react';

export default function Social() {
  const {
    csrActivities,
    employeeParticipations,
    activeUser,
    settings,
    addCsrActivity,
    joinCsrActivity,
    approveParticipation
  } = useContext(ESGDataContext);

  const [activeSubTab, setActiveSubTab] = useState('activities'); // Default Matches excalidraw: CSR Activities

  // Modal control
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState('');

  // Form states
  const [activityForm, setActivityForm] = useState({ name: '', description: '', points: '', evidenceRequired: false });
  const [joinForm, setJoinForm] = useState({ employee: '', proof: '' });

  React.useEffect(() => {
    if (activeUser) {
      setJoinForm(prev => ({ ...prev, employee: activeUser.name }));
    }
  }, [activeUser]);

  const onSubmitActivity = (e) => {
    e.preventDefault();
    if (!activityForm.name || !activityForm.points) return;
    addCsrActivity(activityForm.name, activityForm.description, activityForm.points, activityForm.evidenceRequired);
    setShowAddActivity(false);
    setActivityForm({ name: '', description: '', points: '', evidenceRequired: false });
  };

  const onSubmitJoin = (e) => {
    e.preventDefault();
    const act = csrActivities.find(a => a.id === selectedActivityId);
    if (!act) return;

    if (settings.requireCSRevidence && act.evidence_required && !joinForm.proof) {
      alert("Error: A proof file is required for this activity.");
      return;
    }

    joinCsrActivity(selectedActivityId, joinForm.employee, joinForm.proof);
    setShowJoinModal(false);
    setJoinForm({ employee: activeUser.name, proof: '' });
    setSelectedActivityId('');
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-title-container">
          <h1>Social: CSR & Employee Engagement</h1>
          <p>Register corporate social responsibility programs, sign up for initiatives, and audit completions</p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="tabs-container">
        <button 
          className={`tab-btn social ${activeSubTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('activities')}
        >
          CSR Activities
        </button>
        <button 
          className={`tab-btn social ${activeSubTab === 'participations' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('participations')}
        >
          Employee Participation
        </button>
        <button 
          className={`tab-btn social ${activeSubTab === 'diversity' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('diversity')}
        >
          Diversity Dashboard
        </button>
      </div>

      {/* View: CSR Activities Cards list */}
      {activeSubTab === 'activities' && (
        <div>
          <div className="action-bar">
            <button className="btn btn-primary" onClick={() => setShowAddActivity(true)}>
              <Plus size={16} /> New Activity
            </button>
          </div>

          <div className="cards-grid">
            {csrActivities.map((act) => (
              <div key={act.id} className="info-card">
                <div className="info-card-header">
                  <div className="info-card-title">
                    <UserPlus size={18} color="var(--color-soc)" />
                    {act.name}
                  </div>
                  <span className={`badge-pill ${act.evidence_required ? 'badge-pending' : 'badge-joined'}`}>
                    {act.evidence_required ? 'Evidence Required' : 'Open'}
                  </span>
                </div>
                <p className="info-card-desc">{act.description}</p>
                <div className="info-card-meta">
                  <span style={{ fontWeight: '700', color: 'var(--color-soc)' }}>+{act.points} Points</span>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSelectedActivityId(act.id);
                      setShowJoinModal(true);
                    }}
                  >
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Employee Participations Approval queue */}
      {activeSubTab === 'participations' && (
        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title">Employee Participation: approval queue</div>
          </div>
          <div className="table-container">
            <table className="esg-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Activity / Challenge</th>
                  <th>Proof File</th>
                  <th>Points</th>
                  <th>Status</th>
                  <th>Approval Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeeParticipations.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No employee participations logged.</td>
                  </tr>
                ) : (
                  employeeParticipations.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: '600' }}>{p.employee}</td>
                      <td>{p.activityName}</td>
                      <td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                        {p.proof_url && p.proof_url !== 'none' ? (
                          <a href={p.proof_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-soc)', textDecoration: 'underline' }}>View Proof</a>
                        ) : (
                          'No Proof'
                        )}
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--color-soc)' }}>{p.pointsEarned} Pts</td>
                      <td>
                        <span className={`badge-pill ${
                          p.status === 'Approved' ? 'badge-approved' : 
                          p.status === 'Rejected' ? 'badge-high' : 'badge-pending'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        {p.status === 'Pending' ? (
                          activeUser.role === 'Manager' ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => approveParticipation(p.id, true)}
                                style={{ padding: '4px 8px', borderRadius: '4px' }}
                              >
                                <Check size={14} /> Approve
                              </button>
                              <button 
                                className="btn btn-danger btn-sm" 
                                onClick={() => approveParticipation(p.id, false)}
                                style={{ padding: '4px 8px', borderRadius: '4px' }}
                              >
                                <X size={14} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="badge-pill badge-pending" style={{ fontSize: '0.7rem' }}>Pending Manager Switch</span>
                          )
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Closed</span>
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

      {/* View: Diversity Dashboard */}
      {activeSubTab === 'diversity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="score-circle-grid">
            <div className="score-circle-card" style={{ '--score-color': 'var(--color-soc)' }}>
              <div className="score-title">Gender Diversity Ratio</div>
              <div className="score-display-wrapper">
                <svg className="score-svg" style={{ '--pct': 46 }}>
                  <circle className="score-svg-bg" cx="45" cy="45" r="40" />
                  <circle className="score-svg-fill" cx="45" cy="45" r="40" />
                </svg>
                <div className="score-display-text" style={{ fontSize: '1.2rem' }}>
                  46%
                  <span className="score-display-total" style={{ fontSize: '0.6rem' }}>Female Staff</span>
                </div>
              </div>
            </div>

            <div className="score-circle-card" style={{ '--score-color': 'var(--color-env)' }}>
              <div className="score-title">Local Hiring Rate</div>
              <div className="score-display-wrapper">
                <svg className="score-svg" style={{ '--pct': 82 }}>
                  <circle className="score-svg-bg" cx="45" cy="45" r="40" />
                  <circle className="score-svg-fill" cx="45" cy="45" r="40" />
                </svg>
                <div className="score-display-text" style={{ fontSize: '1.2rem' }}>
                  82%
                  <span className="score-display-total" style={{ fontSize: '0.6rem' }}>Local Source</span>
                </div>
              </div>
            </div>

            <div className="score-circle-card" style={{ '--score-color': 'var(--color-gov)' }}>
              <div className="score-title">CSR Participation Rate</div>
              <div className="score-display-wrapper">
                <svg className="score-svg" style={{ '--pct': 74 }}>
                  <circle className="score-svg-bg" cx="45" cy="45" r="40" />
                  <circle className="score-svg-fill" cx="45" cy="45" r="40" />
                </svg>
                <div className="score-display-text" style={{ fontSize: '1.2rem' }}>
                  74%
                  <span className="score-display-total" style={{ fontSize: '0.6rem' }}>Active Staff</span>
                </div>
              </div>
            </div>

            <div className="score-circle-card" style={{ '--score-color': 'var(--color-accent)' }}>
              <div className="score-title">Training Completion</div>
              <div className="score-display-wrapper">
                <svg className="score-svg" style={{ '--pct': 91 }}>
                  <circle className="score-svg-bg" cx="45" cy="45" r="40" />
                  <circle className="score-svg-fill" cx="45" cy="45" r="40" />
                </svg>
                <div className="score-display-text" style={{ fontSize: '1.2rem' }}>
                  91%
                  <span className="score-display-total" style={{ fontSize: '0.6rem' }}>ESG Certified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-header">
              <div className="panel-title">Diversity & Social Metrics Overview</div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p style={{ marginBottom: '12px' }}>
                EcoSphere monitors and maps critical social criteria inside corporate operations. Our metrics help ensure equal pay structures, high community volunteer engagement, and continuous employee ESG safety training.
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                <li>Average Employee Tenure: 4.8 Years</li>
                <li>Equal Pay Structure Score: 98.4% (Direct correlation check across matching bands)</li>
                <li>Community Outreach Funding: $14,200 (Quarter to date)</li>
                <li>Total Volunteer Hours Accumulated: 320 hours across 5 departments</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Join CSR Activity */}
      {showJoinModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Join CSR Campaign</h3>
              <button className="modal-close-btn" onClick={() => setShowJoinModal(false)}>✕</button>
            </div>
            <form onSubmit={onSubmitJoin}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>Employee Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required
                      value={joinForm.employee}
                      onChange={(e) => setJoinForm(prev => ({ ...prev, employee: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Upload Evidence/Proof Document</label>
                    <input 
                      type="file" 
                      className="form-input" 
                      required={settings.requireCSRevidence && csrActivities.find(a => a.id === selectedActivityId)?.evidence_required}
                      onChange={(e) => setJoinForm(prev => ({ ...prev, proof: e.target.files[0] }))}
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Info size={12} />
                      {csrActivities.find(a => a.id === selectedActivityId)?.evidence_required 
                        ? "This activity requires an attached proof file to earn points." 
                        : "No strict proof file required, but voluntary logging is encouraged."}
                    </small>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowJoinModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Participation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add CSR Activity */}
      {showAddActivity && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Define New CSR Initiative</h3>
              <button className="modal-close-btn" onClick={() => setShowAddActivity(false)}>✕</button>
            </div>
            <form onSubmit={onSubmitActivity}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>Initiative Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Local Food Bank Support"
                      required
                      value={activityForm.name}
                      onChange={(e) => setActivityForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Initiative Description</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Brief summary of CSR action items..."
                      value={activityForm.description}
                      onChange={(e) => setActivityForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
                    <div className="form-group">
                      <label>Earnable Points</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="e.g. 50"
                        required
                        value={activityForm.points}
                        onChange={(e) => setActivityForm(prev => ({ ...prev, points: e.target.value }))}
                      />
                    </div>
                    <div className="form-group" style={{ justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                        <input 
                          type="checkbox" 
                          id="evidenceRequired"
                          checked={activityForm.evidenceRequired}
                          onChange={(e) => setActivityForm(prev => ({ ...prev, evidenceRequired: e.target.checked }))}
                        />
                        <label htmlFor="evidenceRequired" style={{ textTransform: 'none', fontSize: '0.85rem', cursor: 'pointer' }}>Require Proof</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddActivity(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Define Initiative</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

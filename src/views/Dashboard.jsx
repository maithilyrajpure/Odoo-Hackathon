import React, { useContext, useState } from 'react';
import { ESGDataContext } from '../context/ESGDataContext';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Cell
} from 'recharts';
import { 
  Plus, 
  TrendingUp, 
  Play, 
  FileText, 
  X, 
  Activity, 
  FileCheck2, 
  ShieldAlert, 
  Leaf,
  Trophy
} from 'lucide-react';

export default function Dashboard({ setCurrentView }) {
  const { 
    departments, 
    emissionFactors,
    carbonTransactions, 
    employeeParticipations,
    complianceIssues,
    getDepartmentScores, 
    getOverallESGScore,
    logEmissionsTransaction
  } = useContext(ESGDataContext);

  const [showLogModal, setShowLogModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Fleet',
    quantity: '',
    factorId: emissionFactors[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    department: 'Manufacturing'
  });

  const overallScores = getOverallESGScore();

  // Seeding static chart data for 12 months Trend
  const emissionsTrendData = [
    { name: 'Aug', CO2: 2400 },
    { name: 'Sep', CO2: 2100 },
    { name: 'Oct', CO2: 1900 },
    { name: 'Nov', CO2: 2500 },
    { name: 'Dec', CO2: 2800 },
    { name: 'Jan', CO2: 2200 },
    { name: 'Feb', CO2: 1800 },
    { name: 'Mar', CO2: 2100 },
    { name: 'Apr', CO2: 2600 },
    { name: 'May', CO2: 2900 },
    { name: 'Jun', CO2: 2300 },
    { name: 'Jul', CO2: 1950 },
  ];

  // Dynamic ranking based on live department scores
  const deptRankingData = departments
    .filter(d => d.status === 'Active')
    .map(d => {
      const scores = getDepartmentScores(d.name);
      return {
        name: d.code,
        Score: scores.total,
        fullName: d.name
      };
    });

  const sortedDepartmentsLeaderboard = departments
    .filter(d => d.status === 'Active')
    .map(d => {
      const scores = getDepartmentScores(d.name);
      return {
        id: d.id,
        name: d.name,
        code: d.code,
        scores
      };
    })
    .sort((a, b) => b.scores.total - a.scores.total);

  // Recent Activity Feed matching the mockup entries
  const recentActivities = [
    { id: 'a1', type: 'social', text: 'Priya Sharma completed challenge "Recycle Challenge"', date: 'July 11, 2026', icon: FileCheck2 },
    { id: 'a2', type: 'gov', text: 'New Compliance Issue raised: "Missing MSDS sheets" in Manufacturing', date: 'July 10, 2026', icon: ShieldAlert },
    { id: 'a3', type: 'env', text: `${carbonTransactions.length} total Carbon Transactions registered in ledger`, date: 'July 09, 2026', icon: Leaf },
    { id: 'a4', type: 'gov', text: 'Aditi Rao acknowledged Policy: "Supplier Code of Conduct"', date: 'July 08, 2026', icon: Activity },
  ];

  const handleOpenLogModal = () => {
    setShowLogModal(true);
  };

  const handleCloseLogModal = () => {
    setShowLogModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitLog = (e) => {
    e.preventDefault();
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    logEmissionsTransaction(
      formData.type,
      parseFloat(formData.quantity),
      formData.factorId,
      formData.date,
      formData.department
    );
    setShowLogModal(false);
    setFormData(prev => ({ ...prev, quantity: '' }));
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-title-container">
          <h1>Dashboard: Executive Overview</h1>
          <p>Real-time corporate performance index across Environmental, Social, and Governance pillars</p>
        </div>
      </div>

      {/* SVG Score Circular Indicators */}
      <div className="score-circle-grid">
        {/* Environmental Score Card */}
        <div className="score-circle-card" style={{ '--score-color': 'var(--color-env)' }}>
          <div className="score-title">Environmental Score</div>
          <div className="score-display-wrapper">
            <svg className="score-svg" style={{ '--pct': overallScores.environmental }}>
              <circle className="score-svg-bg" cx="45" cy="45" r="40" />
              <circle className="score-svg-fill" cx="45" cy="45" r="40" />
            </svg>
            <div className="score-display-text">
              {overallScores.environmental}
              <span className="score-display-total">/ 100</span>
            </div>
          </div>
        </div>

        {/* Social Score Card */}
        <div className="score-circle-card" style={{ '--score-color': 'var(--color-soc)' }}>
          <div className="score-title">Social Score</div>
          <div className="score-display-wrapper">
            <svg className="score-svg" style={{ '--pct': overallScores.social }}>
              <circle className="score-svg-bg" cx="45" cy="45" r="40" />
              <circle className="score-svg-fill" cx="45" cy="45" r="40" />
            </svg>
            <div className="score-display-text">
              {overallScores.social}
              <span className="score-display-total">/ 100</span>
            </div>
          </div>
        </div>

        {/* Governance Score Card */}
        <div className="score-circle-card" style={{ '--score-color': 'var(--color-gov)' }}>
          <div className="score-title">Governance Score</div>
          <div className="score-display-wrapper">
            <svg className="score-svg" style={{ '--pct': overallScores.governance }}>
              <circle className="score-svg-bg" cx="45" cy="45" r="40" />
              <circle className="score-svg-fill" cx="45" cy="45" r="40" />
            </svg>
            <div className="score-display-text">
              {overallScores.governance}
              <span className="score-display-total">/ 100</span>
            </div>
          </div>
        </div>

        {/* Overall ESG Score Card */}
        <div className="score-circle-card" style={{ '--score-color': '#fff' }}>
          <div className="score-title" style={{ color: '#fff', fontWeight: '700' }}>Overall ESG Score</div>
          <div className="score-display-wrapper">
            <svg className="score-svg" style={{ '--pct': overallScores.total }}>
              <circle className="score-svg-bg" cx="45" cy="45" r="40" />
              <circle className="score-svg-fill" cx="45" cy="45" r="40" style={{ stroke: 'url(#grad-overall)' }} />
              <defs>
                <linearGradient id="grad-overall" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-env)" />
                  <stop offset="50%" stopColor="var(--color-soc)" />
                  <stop offset="100%" stopColor="var(--color-gov)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="score-display-text">
              {overallScores.total}
              <span className="score-display-total">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="panel-grid">
        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title">
              <TrendingUp size={18} color="var(--color-env)" />
              Emissions Trend (12 mo)
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>kg CO2e / month</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emissionsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#121814', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="CO2" 
                  stroke="var(--color-env)" 
                  strokeWidth={3} 
                  dot={{ r: 4, stroke: 'var(--bg-main)', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title">
              <Activity size={18} color="var(--color-soc)" />
              Department ESG Ranking
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weighted Score %</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptRankingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ background: '#121814', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }}
                  labelFormatter={(value, items) => items[0]?.payload.fullName || value}
                />
                <Bar dataKey="Score" radius={[6, 6, 0, 0]} barSize={28}>
                  {deptRankingData.map((entry, index) => {
                    // Cyclic colors based on columns
                    const colors = ['#2ecc71', '#4fc3f7', '#a855f7', '#f59e0b', '#ec4899'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={0.7} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Logs & Quick Actions Deck */}
      <div className="panel-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {/* Department Leaderboard Panel */}
        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title">
              <Trophy size={18} color="var(--color-accent)" />
              Department ESG Leaderboard
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ranked</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px 0' }}>
            {sortedDepartmentsLeaderboard.map((dept, index) => {
              const rank = index + 1;
              const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏅';
              return (
                <div key={dept.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: '800', width: '20px', textAlign: 'center' }}>
                      {medal}
                    </span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#fff' }}>{dept.name}</div>
                      <div style={{ display: 'flex', gap: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        <span>E: <strong style={{ color: 'var(--color-env)' }}>{dept.scores.environmental}</strong></span>
                        <span>S: <strong style={{ color: 'var(--color-soc)' }}>{dept.scores.social}</strong></span>
                        <span>G: <strong style={{ color: 'var(--color-gov)' }}>{dept.scores.governance}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--color-env)' }}>
                      {dept.scores.total}%
                    </div>
                    <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Score</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title">Recent Activity</div>
          </div>
          <div className="activity-list">
            {recentActivities.map((act) => {
              const IconComp = act.icon;
              const accentColor = act.type === 'env' ? 'var(--color-env)' : act.type === 'social' ? 'var(--color-soc)' : 'var(--color-gov)';
              return (
                <div key={act.id} className="activity-item">
                  <div className="activity-icon-indicator" style={{ color: accentColor }}>
                    <IconComp size={14} />
                  </div>
                  <div className="activity-text-wrapper">
                    <div className="activity-item-text">{act.text}</div>
                    <div className="activity-item-date">{act.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title">Quick Actions</div>
          </div>
          <div className="quick-actions-list">
            <button 
              className="quick-action-btn" 
              style={{ '--action-color': 'var(--color-env)' }}
              onClick={handleOpenLogModal}
            >
              <span className="quick-action-icon"><Plus size={16} /></span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '600' }}>Log Carbon Data</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Add emission ledger values</span>
              </div>
            </button>
            
            <button 
              className="quick-action-btn" 
              style={{ '--action-color': 'var(--color-accent)' }}
              onClick={() => setCurrentView('gamification')}
            >
              <span className="quick-action-icon"><Play size={16} /></span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '600' }}>Start Challenge</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Enroll in gamified campaigns</span>
              </div>
            </button>

            <button 
              className="quick-action-btn" 
              style={{ '--action-color': 'var(--color-gov)' }}
              onClick={() => setCurrentView('reports')}
            >
              <span className="quick-action-icon"><FileText size={16} /></span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '600' }}>View Reports</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Generate filtered data sheets</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Carbon Logging Quick Action Modal */}
      {showLogModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Log Carbon Emissions Data</h3>
              <button className="modal-close-btn" onClick={handleCloseLogModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmitLog}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>Operation Type</label>
                    <select 
                      className="form-select" 
                      name="type" 
                      value={formData.type} 
                      onChange={handleInputChange}
                    >
                      <option value="Fleet">Fleet Operations</option>
                      <option value="Purchase">Purchases / Procurement</option>
                      <option value="Manufacturing">Manufacturing Operations</option>
                      <option value="Expenses">Corporate Expenses</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Emission Factor (Master Reference)</label>
                    <select 
                      className="form-select" 
                      name="factorId" 
                      value={formData.factorId} 
                      onChange={handleInputChange}
                    >
                      {emissionFactors.map(f => (
                        <option key={f.id} value={f.id}>{f.name} ({f.co2PerUnit} kg CO2e / {f.unit})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
                    <div className="form-group">
                      <label>Quantity</label>
                      <input 
                        type="number" 
                        step="any"
                        className="form-input" 
                        name="quantity"
                        placeholder="Amount consumed"
                        required
                        value={formData.quantity}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Department</label>
                      <select 
                        className="form-select" 
                        name="department" 
                        value={formData.department} 
                        onChange={handleInputChange}
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseLogModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Log Emissions</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

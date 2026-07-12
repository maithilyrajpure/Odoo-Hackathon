import React, { useContext, useState } from 'react';
import { ESGDataContext } from '../context/ESGDataContext';
import { Plus, Search, HelpCircle, Save } from 'lucide-react';

export default function Settings() {
  const {
    departments,
    categories,
    settings,
    addDepartment,
    handleUpdateSettings
  } = useContext(ESGDataContext);

  const [activeSubTab, setActiveSubTab] = useState('departments'); // Default matches excalidraw: Departments

  // Modal control
  const [showAddDept, setShowAddDept] = useState(false);

  // Form state
  const [deptForm, setDeptForm] = useState({ name: '', code: '', head: '', parentDept: '—', employees: '' });

  const onSubmitDept = (e) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code || !deptForm.head) return;
    addDepartment(deptForm.name, deptForm.code, deptForm.head, deptForm.parentDept, deptForm.employees);
    setShowAddDept(false);
    setDeptForm({ name: '', code: '', head: '', parentDept: '—', employees: '' });
  };

  const handleToggleSetting = (key) => {
    handleUpdateSettings(key);
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-title-container">
          <h1>Settings: Configuration & Administration</h1>
          <p>Maintain corporate structure, category variables, and configure business automation rules</p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="tabs-container">
        <button 
          className={`tab-btn reports ${activeSubTab === 'departments' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('departments')}
        >
          Departments
        </button>
        <button 
          className={`tab-btn reports ${activeSubTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('categories')}
        >
          Categories
        </button>
        <button 
          className={`tab-btn reports ${activeSubTab === 'configuration' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('configuration')}
        >
          ESG Configuration
        </button>
        <button 
          className={`tab-btn reports ${activeSubTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('notifications')}
        >
          Notification Settings
        </button>
      </div>

      {/* View: Departments list */}
      {activeSubTab === 'departments' && (
        <div className="panel-card">
          <div className="action-bar">
            <button className="btn btn-primary" onClick={() => setShowAddDept(true)}>
              <Plus size={16} /> New Department
            </button>
          </div>

          <div className="table-container">
            <table className="esg-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Code</th>
                  <th>Department Head</th>
                  <th>Parent Dept</th>
                  <th>Employees</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: '600' }}>{d.name}</td>
                    <td>{d.code}</td>
                    <td>{d.head}</td>
                    <td>{d.parentDept}</td>
                    <td>{d.employees.toLocaleString()}</td>
                    <td>
                      <span className="badge-pill badge-approved">{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Shared Categories List */}
      {activeSubTab === 'categories' && (
        <div className="panel-card">
          <div className="table-container">
            <table className="esg-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Module Focus</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: '600' }}>{c.name}</td>
                    <td>
                      <span className={`badge-pill ${
                        c.type === 'Environmental' ? 'badge-approved' : 
                        c.type === 'Social' ? 'badge-joined' : 'badge-underreview'
                      }`}>
                        {c.type}
                      </span>
                    </td>
                    <td>
                      <span className="badge-pill badge-approved">{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: ESG Configuration & Automation Rules */}
      {activeSubTab === 'configuration' && (
        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title">ESG Configuration & Notifications</div>
          </div>

          <div className="switch-container">
            <div className="switch-item">
              <div className="switch-label-group">
                <span className="switch-title">Enable auto emission calculation</span>
                <span className="switch-desc">Calculate carbon equivalent scores automatically when operational data is logged.</span>
              </div>
              <label className="switch-input-wrapper">
                <input 
                  type="checkbox" 
                  checked={settings.autoEmissionCalc} 
                  onChange={() => handleToggleSetting('autoEmissionCalc')}
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="switch-item">
              <div className="switch-label-group">
                <span className="switch-title">Require evidence for all CSR activities</span>
                <span className="switch-desc">Employees must upload a document/photo proof for volunteer credit approval.</span>
              </div>
              <label className="switch-input-wrapper">
                <input 
                  type="checkbox" 
                  checked={settings.requireCSRevidence} 
                  onChange={() => handleToggleSetting('requireCSRevidence')}
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="switch-item">
              <div className="switch-label-group">
                <span className="switch-title">Auto-award badges on challenge completion</span>
                <span className="switch-desc">Unlock and bind achievement badges as soon as challenge requirements are fully approved.</span>
              </div>
              <label className="switch-input-wrapper">
                <input 
                  type="checkbox" 
                  checked={settings.autoAwardBadges} 
                  onChange={() => handleToggleSetting('autoAwardBadges')}
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="switch-item">
              <div className="switch-label-group">
                <span className="switch-title">Email alerts for new compliance issues</span>
                <span className="switch-desc">Notify owners immediately when a compliance audit discrepancy is raised.</span>
              </div>
              <label className="switch-input-wrapper">
                <input 
                  type="checkbox" 
                  checked={settings.emailAlerts} 
                  onChange={() => handleToggleSetting('emailAlerts')}
                />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* View: Notification Settings (Placeholder configs matching mock tab) */}
      {activeSubTab === 'notifications' && (
        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title">Channels and Contact Settings</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <p>Configure how alert notifications feed the sidebar logs and email distribution lists.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="c1" defaultChecked />
                <label htmlFor="c1" style={{ color: '#fff', cursor: 'pointer' }}>In-App Banner for Badge Unlocks</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="c2" defaultChecked />
                <label htmlFor="c2" style={{ color: '#fff', cursor: 'pointer' }}>Weekly Digest to Department Heads</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="c3" />
                <label htmlFor="c3" style={{ color: '#fff', cursor: 'pointer' }}>Slack Channel Integration Hook</label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Department */}
      {showAddDept && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Create Corporate Department</h3>
              <button className="modal-close-btn" onClick={() => setShowAddDept(false)}>✕</button>
            </div>
            <form onSubmit={onSubmitDept}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>Department Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Sales Division"
                      required
                      value={deptForm.name}
                      onChange={(e) => setDeptForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
                    <div className="form-group">
                      <label>Department Code</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. SAL"
                        required
                        value={deptForm.code}
                        onChange={(e) => setDeptForm(prev => ({ ...prev, code: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Department Head</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. J. Doe"
                        required
                        value={deptForm.head}
                        onChange={(e) => setDeptForm(prev => ({ ...prev, head: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
                    <div className="form-group">
                      <label>Parent Department</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Corporate"
                        value={deptForm.parentDept}
                        onChange={(e) => setDeptForm(prev => ({ ...prev, parentDept: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Employee Count</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="e.g. 24"
                        required
                        value={deptForm.employees}
                        onChange={(e) => setDeptForm(prev => ({ ...prev, employees: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddDept(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Department</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

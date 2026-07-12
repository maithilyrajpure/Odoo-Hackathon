import React, { useContext, useState } from 'react';
import { ESGDataContext } from '../context/ESGDataContext';
import { Plus, Check, ShieldAlert, FileText, Search } from 'lucide-react';

export default function Governance() {
  const {
    policies,
    policyAcknowledgements,
    audits,
    complianceIssues,
    departments,
    activeUser,
    acknowledgePolicy,
    createComplianceIssue,
    resolveComplianceIssue,
    setAudits
  } = useContext(ESGDataContext);

  const [activeSubTab, setActiveSubTab] = useState('audits'); // Default matches excalidraw: Audits
  const [searchTerm, setSearchTerm] = useState('');

  // Policy detailed view modal
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // Form modals visibility
  const [showAddAudit, setShowAddAudit] = useState(false);
  const [showAddIssue, setShowAddIssue] = useState(false);

  // Form states
  const [auditForm, setAuditForm] = useState({ title: '', department: 'Manufacturing', auditor: activeUser.name, findings: '' });
  const [issueForm, setIssueForm] = useState({ auditTitle: audits[0]?.title || '', issue: '', severity: 'Medium', department: 'Manufacturing', owner: activeUser.name, dueDate: '' });

  // Exporters
  const handleExportCsv = (data, filename) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = Object.keys(data[0] || {}).join(",");
    csvContent += headers + "\r\n";
    data.forEach(row => {
      const values = Object.values(row).map(val => `"${val}"`).join(",");
      csvContent += values + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onSubmitAudit = (e) => {
    e.preventDefault();
    if (!auditForm.title) return;
    const newAudit = {
      id: String(Date.now()),
      title: auditForm.title,
      department: auditForm.department,
      auditor: auditForm.auditor,
      date: new Date().toISOString().split('T')[0],
      findings: auditForm.findings || 'Pending detailed inspection report',
      status: 'Under Review'
    };
    setAudits(prev => [...prev, newAudit]);
    setShowAddAudit(false);
    setAuditForm({ title: '', department: 'Manufacturing', auditor: activeUser.name, findings: '' });
  };

  const onSubmitIssue = (e) => {
    e.preventDefault();
    if (!issueForm.issue || !issueForm.dueDate) return;
    createComplianceIssue(
      issueForm.auditTitle,
      issueForm.issue,
      issueForm.severity,
      issueForm.department,
      issueForm.owner,
      issueForm.dueDate
    );
    setShowAddIssue(false);
    setIssueForm({ auditTitle: audits[0]?.title || '', issue: '', severity: 'Medium', department: 'Manufacturing', owner: activeUser.name, dueDate: '' });
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-title-container">
          <h1>Governance: Policies, Audits & Compliance</h1>
          <p>Enforce corporate guidelines, log security or compliance audits, and track critical remediations</p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="tabs-container">
        <button 
          className={`tab-btn governance ${activeSubTab === 'policies' ? 'active' : ''}`}
          onClick={() => { setActiveSubTab('policies'); setSearchTerm(''); }}
        >
          Policies
        </button>
        <button 
          className={`tab-btn governance ${activeSubTab === 'acknowledgements' ? 'active' : ''}`}
          onClick={() => { setActiveSubTab('acknowledgements'); setSearchTerm(''); }}
        >
          Policy Acknowledgements
        </button>
        <button 
          className={`tab-btn governance ${activeSubTab === 'audits' ? 'active' : ''}`}
          onClick={() => { setActiveSubTab('audits'); setSearchTerm(''); }}
        >
          Audits
        </button>
        <button 
          className={`tab-btn governance ${activeSubTab === 'issues' ? 'active' : ''}`}
          onClick={() => { setActiveSubTab('issues'); setSearchTerm(''); }}
        >
          Compliance Issues
        </button>
      </div>

      {/* View: Governance Audits List */}
      {activeSubTab === 'audits' && (
        <div className="panel-card">
          <div className="action-bar">
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={() => setShowAddAudit(true)}>
                <Plus size={16} /> New Audit
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => handleExportCsv(audits, "compliance_audits")}
              >
                Export
              </button>
            </div>
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input 
                type="text" 
                className="form-input search-input" 
                placeholder="Search audits..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="esg-table">
              <thead>
                <tr>
                  <th>Audit Title</th>
                  <th>Department</th>
                  <th>Auditor</th>
                  <th>Date Logged</th>
                  <th>Findings</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {audits.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())).map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: '600' }}>{a.title}</td>
                    <td>{a.department}</td>
                    <td>{a.auditor}</td>
                    <td>{a.date}</td>
                    <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.findings}</td>
                    <td>
                      <span className={`badge-pill ${
                        a.status === 'Completed' ? 'badge-approved' : 'badge-underreview'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Compliance Issues Raised from Audits */}
      {activeSubTab === 'issues' && (
        <div className="panel-card">
          <div className="action-bar">
            <button className="btn btn-primary" onClick={() => setShowAddIssue(true)}>
              <Plus size={16} /> Raise Issue
            </button>
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input 
                type="text" 
                className="form-input search-input" 
                placeholder="Search issues..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="esg-table">
              <thead>
                <tr>
                  <th>Audit Mapping</th>
                  <th>Compliance Issue</th>
                  <th>Severity</th>
                  <th>Department</th>
                  <th>Owner</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complianceIssues.filter(i => i.issue.toLowerCase().includes(searchTerm.toLowerCase())).map((i) => (
                  <tr key={i.id}>
                    <td>{i.auditTitle}</td>
                    <td style={{ fontWeight: '600' }}>{i.issue}</td>
                    <td>
                      <span className={`badge-pill ${
                        i.severity === 'High' ? 'badge-high' : 'badge-pending'
                      }`}>
                        {i.severity}
                      </span>
                    </td>
                    <td>{i.department}</td>
                    <td>{i.owner}</td>
                    <td>{i.dueDate}</td>
                    <td>
                      <span className={`badge-pill ${
                        i.status === 'Open' ? 'badge-high' : 'badge-approved'
                      }`}>
                        {i.status}
                      </span>
                    </td>
                    <td>
                      {i.status === 'Open' ? (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => resolveComplianceIssue(i.id)}
                        >
                          Resolve
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Governance Corporate Policies list */}
      {activeSubTab === 'policies' && (
        <div className="cards-grid">
          {policies.map((p) => {
            const hasSigned = policyAcknowledgements.some(a => a.policyTitle === p.title && a.employee === activeUser.name);
            return (
              <div key={p.id} className="info-card">
                <div className="info-card-header">
                  <div className="info-card-title">
                    <FileText size={18} color="var(--color-gov)" />
                    {p.title}
                  </div>
                  <span className={`badge-pill ${hasSigned ? 'badge-approved' : 'badge-pending'}`}>
                    {hasSigned ? 'Signed' : 'Acknowledge Required'}
                  </span>
                </div>
                <p className="info-card-desc" style={{ webkitLineClamp: 3, display: '-webkit-box', webkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.content}</p>
                <div className="info-card-meta">
                  <span>Version {p.version}</span>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedPolicy(p)}
                  >
                    View Policy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View: Policy Acknowledgements Table */}
      {activeSubTab === 'acknowledgements' && (
        <div className="panel-card">
          <div className="table-container">
            <table className="esg-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Signed Policy</th>
                  <th>Signature Date</th>
                </tr>
              </thead>
              <tbody>
                {policyAcknowledgements.map((ack) => (
                  <tr key={ack.id}>
                    <td style={{ fontWeight: '600' }}>{ack.employee}</td>
                    <td>{ack.policyTitle}</td>
                    <td>{ack.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Auditor Signature Timeline */}
      <div className="panel-card" style={{ marginTop: '24px' }}>
        <div className="panel-header">
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--color-gov)" />
            Auditor Signature Timeline
          </div>
        </div>
        <div style={{ padding: '10px 0' }}>
          {policyAcknowledgements.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No policy signatures recorded yet.</p>
          ) : (
            <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid rgba(168, 85, 247, 0.3)', margin: '10px 0 10px 10px' }}>
              {[...policyAcknowledgements].reverse().map((ack) => {
                const ts = ack.created_at ? new Date(ack.created_at).toLocaleString() : `${ack.date} 09:00:00`;
                return (
                  <div key={ack.id} style={{ position: 'relative', marginBottom: '16px' }}>
                    <div style={{ 
                      position: 'absolute', 
                      left: '-26px', 
                      top: '4px', 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      background: 'var(--color-gov)',
                      boxShadow: '0 0 8px var(--color-gov)'
                    }}></div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: '#fff' }}>{ack.employee}</strong> signed <em style={{ color: 'var(--color-gov)', fontStyle: 'normal', fontWeight: '600' }}>{ack.policyTitle}</em> at <span style={{ fontFamily: 'monospace', color: 'var(--color-soc)' }}>{ts}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Policy Detailed view & Acknowledge */}
      {selectedPolicy && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">{selectedPolicy.title} ({selectedPolicy.version})</h3>
              <button className="modal-close-btn" onClick={() => setSelectedPolicy(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Effective Date: {selectedPolicy.effectiveDate}</p>
                <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  {selectedPolicy.content}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  By clicking Acknowledge below, you confirm that you have read, understood, and agree to align with all operational standards outlined in this governance document.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedPolicy(null)}>Close</button>
              {!policyAcknowledgements.some(a => a.policyTitle === selectedPolicy.title && a.employee === activeUser.name) ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    acknowledgePolicy(selectedPolicy.title);
                    setSelectedPolicy(null);
                  }}
                >
                  <Check size={16} /> Acknowledge Policy
                </button>
              ) : (
                <span className="badge-pill badge-approved" style={{ height: '36px', display: 'flex', alignItems: 'center' }}>Already Signed</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Log New Audit */}
      {showAddAudit && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Schedule Compliance Audit</h3>
              <button className="modal-close-btn" onClick={() => setShowAddAudit(false)}>✕</button>
            </div>
            <form onSubmit={onSubmitAudit}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>Audit Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Q3 Security & Access Audit"
                      required
                      value={auditForm.title}
                      onChange={(e) => setAuditForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
                    <div className="form-group">
                      <label>Auditor Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        required
                        value={auditForm.auditor}
                        onChange={(e) => setAuditForm(prev => ({ ...prev, auditor: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Audited Department</label>
                      <select 
                        className="form-select"
                        value={auditForm.department}
                        onChange={(e) => setAuditForm(prev => ({ ...prev, department: e.target.value }))}
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Initial Findings / Scope Summary</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Scope or initial audit feedback..."
                      value={auditForm.findings}
                      onChange={(e) => setAuditForm(prev => ({ ...prev, findings: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddAudit(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Audit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Raise Compliance Issue */}
      {showAddIssue && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Raise Governance Violation Issue</h3>
              <button className="modal-close-btn" onClick={() => setShowAddIssue(false)}>✕</button>
            </div>
            <form onSubmit={onSubmitIssue}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>Audit Origin Reference</label>
                    <select 
                      className="form-select"
                      value={issueForm.auditTitle}
                      onChange={(e) => setIssueForm(prev => ({ ...prev, auditTitle: e.target.value }))}
                    >
                      {audits.map(a => (
                        <option key={a.id} value={a.title}>{a.title} ({a.department})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Violation/Issue Description</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Inadequate scrap metal sorting records"
                      required
                      value={issueForm.issue}
                      onChange={(e) => setIssueForm(prev => ({ ...prev, issue: e.target.value }))}
                    />
                  </div>

                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
                    <div className="form-group">
                      <label>Severity Level</label>
                      <select 
                        className="form-select"
                        value={issueForm.severity}
                        onChange={(e) => setIssueForm(prev => ({ ...prev, severity: e.target.value }))}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Target Department</label>
                      <select 
                        className="form-select"
                        value={issueForm.department}
                        onChange={(e) => setIssueForm(prev => ({ ...prev, department: e.target.value }))}
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
                    <div className="form-group">
                      <label>Assigned Issue Owner</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        required
                        value={issueForm.owner}
                        onChange={(e) => setIssueForm(prev => ({ ...prev, owner: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Resolution Due Date</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        required
                        value={issueForm.dueDate}
                        onChange={(e) => setIssueForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddIssue(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Raise Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

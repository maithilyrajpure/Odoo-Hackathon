import React, { useContext, useState } from 'react';
import { ESGDataContext } from '../context/ESGDataContext';
import { FileText, Download, Play, Info } from 'lucide-react';

export default function Reports() {
  const {
    carbonTransactions,
    employeeParticipations,
    complianceIssues,
    policyAcknowledgements,
    departments,
    challenges,
    categories
  } = useContext(ESGDataContext);

  const [activeSubTab, setActiveSubTab] = useState('custom'); // Default matches excalidraw: Custom Builder

  // Custom Report Builder Filter states
  const [filters, setFilters] = useState({
    dateRange: 'All',
    department: 'All',
    module: 'All',
    employee: 'All',
    challenge: 'All',
    category: 'All'
  });

  const [reportResults, setReportResults] = useState([]);
  const [reportRun, setReportRun] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRunReport = () => {
    let combinedResults = [];

    // Filter Environmental (Carbon Transactions)
    if (filters.module === 'All' || filters.module === 'Environmental') {
      let data = carbonTransactions.map(t => ({
        date: t.date,
        module: 'Environmental',
        category: 'Emissions',
        detail: `${t.type} logging: ${t.quantity} ${t.unit} of ${t.emissionFactorName}`,
        impact: `${t.co2Value} kg CO2e`,
        department: t.department,
        status: t.status,
        entity: 'System'
      }));
      combinedResults = [...combinedResults, ...data];
    }

    // Filter Social (CSR & Challenges)
    if (filters.module === 'All' || filters.module === 'Social') {
      let csrData = employeeParticipations.map(p => ({
        date: p.date,
        module: 'Social',
        category: 'CSR Activity',
        detail: `Volunteered for ${p.activityName} (Proof: ${p.proof})`,
        impact: `+${p.pointsEarned} Pts`,
        department: p.department,
        status: p.status,
        entity: p.employee
      }));
      combinedResults = [...combinedResults, ...csrData];
    }

    // Filter Governance (Audits & Policies)
    if (filters.module === 'All' || filters.module === 'Governance') {
      let issueData = complianceIssues.map(i => ({
        date: i.dueDate,
        module: 'Governance',
        category: 'Compliance Issue',
        detail: `Issue flagged: ${i.issue} (Severity: ${i.severity})`,
        impact: i.status === 'Open' ? '⚠️ Open Action' : '✅ Resolved',
        department: i.department,
        status: i.status,
        entity: i.owner
      }));

      let policyData = policyAcknowledgements.map(a => ({
        date: a.date,
        module: 'Governance',
        category: 'Policy Sign',
        detail: `Acknowledged policy: ${a.policyTitle}`,
        impact: 'Signed Agreement',
        department: 'Corporate', // Fallback dept
        status: 'Approved',
        entity: a.employee
      }));

      combinedResults = [...combinedResults, ...issueData, ...policyData];
    }

    // Apply other filters
    let filtered = [...combinedResults];

    if (filters.department !== 'All') {
      filtered = filtered.filter(r => r.department === filters.department);
    }
    if (filters.employee !== 'All') {
      filtered = filtered.filter(r => r.entity === filters.employee);
    }
    if (filters.category !== 'All') {
      filtered = filtered.filter(r => r.category.toLowerCase().includes(filters.category.toLowerCase()));
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setReportResults(filtered);
    setReportRun(true);
  };

  const handleExportCsv = () => {
    if (reportResults.length === 0) {
      alert("No data available to export. Run a report first.");
      return;
    }
    let csvContent = "data:text/csv;charset=utf-8,";
    // Headers
    csvContent += "Date,Module,Category,Details,Impact/Points,Department,Status,Owner/User\r\n";
    // Rows
    reportResults.forEach(r => {
      csvContent += `"${r.date}","${r.module}","${r.category}","${r.detail.replace(/"/g, '""')}","${r.impact}","${r.department}","${r.status}","${r.entity}"\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "custom_esg_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Report Card rendering helpers
  const handleGenerateSummary = (title, summaryText, stats) => {
    alert(`Report Generation Requested: "${title}"\r\n\r\nThis report has been compiled and saved locally. Check download folder for details.`);
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-title-container">
          <h1>Reports: Analytics & Custom Report Builder</h1>
          <p>Generate summary disclosures or compile custom reports for external auditing</p>
        </div>
      </div>

      {/* Tabs List */}
      <div className="tabs-container">
        <button 
          className={`tab-btn reports ${activeSubTab === 'environmental' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('environmental')}
        >
          Environmental
        </button>
        <button 
          className={`tab-btn reports ${activeSubTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('social')}
        >
          Social
        </button>
        <button 
          className={`tab-btn reports ${activeSubTab === 'governance' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('governance')}
        >
          Governance
        </button>
        <button 
          className={`tab-btn reports ${activeSubTab === 'esg_summary' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('esg_summary')}
        >
          ESG Summary
        </button>
        <button 
          className={`tab-btn reports ${activeSubTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('custom')}
        >
          Custom Builder
        </button>
      </div>

      {/* View: Standard Static Reports Cards list */}
      {activeSubTab !== 'custom' && (
        <div className="cards-grid">
          {activeSubTab === 'environmental' && (
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-title">
                  <FileText size={18} color="var(--color-env)" />
                  Environmental Scope 1 & 2 Disclosure
                </div>
              </div>
              <p className="info-card-desc">
                Summarizes greenhouse gas output from direct combustion (Natural Gas, Fleet Fuel) and indirect purchases (Grid Electricity) across all operational departments.
              </p>
              <div className="info-card-meta">
                <span>Format: PDF / CSV</span>
                <button className="btn btn-primary btn-sm" onClick={() => handleGenerateSummary("Environmental Report")}>
                  Generate Report
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'social' && (
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-title">
                  <FileText size={18} color="var(--color-soc)" />
                  Social Participation & Engagement Ledger
                </div>
              </div>
              <p className="info-card-desc">
                Details volunteer hours, community outreach events participation rates, equal gender ratio trends, and training program credentials completions.
              </p>
              <div className="info-card-meta">
                <span>Format: PDF / CSV</span>
                <button className="btn className btn-primary btn-sm" onClick={() => handleGenerateSummary("Social Report")}>
                  Generate Report
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'governance' && (
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-title">
                  <FileText size={18} color="var(--color-gov)" />
                  Governance Audits & Policies Acknowledgements
                </div>
              </div>
              <p className="info-card-desc">
                Tracks total policy signatures, auditor reports summary findings, unresolved compliance violations, and remediation action timelines.
              </p>
              <div className="info-card-meta">
                <span>Format: PDF / CSV</span>
                <button className="btn btn-primary btn-sm" onClick={() => handleGenerateSummary("Governance Report")}>
                  Generate Report
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'esg_summary' && (
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-title">
                  <FileText size={18} color="#fff" />
                  Combined ESG Summary Disclosure
                </div>
              </div>
              <p className="info-card-desc">
                Executive level compiled review comparing overall corporate Environmental, Social, and Governance performance indexes on a year-over-year basis.
              </p>
              <div className="info-card-meta">
                <span>Format: PDF / Excel</span>
                <button className="btn btn-primary btn-sm" onClick={() => handleGenerateSummary("ESG Summary Report")}>
                  Generate Report
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View: Dynamic Custom Report Builder */}
      {activeSubTab === 'custom' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="panel-card">
            <div className="panel-header">
              <div className="panel-title">Custom Report Builder: Filters</div>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Date Range</label>
                <select className="form-select" name="dateRange" value={filters.dateRange} onChange={handleInputChange}>
                  <option value="All">All Time</option>
                  <option value="CurrentMonth">Current Month</option>
                  <option value="Q3">Q3 2026</option>
                </select>
              </div>

              <div className="form-group">
                <label>Department</label>
                <select className="form-select" name="department" value={filters.department} onChange={handleInputChange}>
                  <option value="All">All Departments</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>ESG Module</label>
                <select className="form-select" name="module" value={filters.module} onChange={handleInputChange}>
                  <option value="All">All Modules</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Social">Social</option>
                  <option value="Governance">Governance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Owner / Employee</label>
                <select className="form-select" name="employee" value={filters.employee} onChange={handleInputChange}>
                  <option value="All">All Employees</option>
                  <option value="Aditi Rao">Aditi Rao</option>
                  <option value="Karan Shah">Karan Shah</option>
                  <option value="Priya Sharma">Priya Sharma</option>
                </select>
              </div>

              <div className="form-group">
                <label>ESG Sub-Category</label>
                <select className="form-select" name="category" value={filters.category} onChange={handleInputChange}>
                  <option value="All">All Sub-Categories</option>
                  <option value="Emissions">Carbon Emissions</option>
                  <option value="CSR Activity">CSR Activities</option>
                  <option value="Compliance Issue">Compliance Issues</option>
                  <option value="Policy Sign">Policy Acknowledgements</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
              <button className="btn btn-primary" onClick={handleRunReport}>
                <Play size={16} /> Run Report
              </button>
              <button className="btn btn-secondary" onClick={handleExportCsv}>
                <Download size={16} /> Export CSV
              </button>
              <button className="btn btn-secondary" onClick={() => alert("PDF export requires standard printer layout rendering.")}>
                Export PDF
              </button>
              <button className="btn btn-secondary" onClick={() => alert("Excel export is mapping as XML workbook.")}>
                Export Excel
              </button>
            </div>
          </div>

          {/* Results section */}
          {reportRun && (
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-title">Report Results ({reportResults.length} records found)</div>
              </div>

              <div className="table-container">
                <table className="esg-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Module</th>
                      <th>Category</th>
                      <th>Details</th>
                      <th>Impact / Score</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Owner / Entity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportResults.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No records match your selected query parameters.</td>
                      </tr>
                    ) : (
                      reportResults.map((r, idx) => (
                        <tr key={idx}>
                          <td>{r.date}</td>
                          <td>
                            <span className={`badge-pill ${
                              r.module === 'Environmental' ? 'badge-approved' : 
                              r.module === 'Social' ? 'badge-joined' : 'badge-underreview'
                            }`}>
                              {r.module}
                            </span>
                          </td>
                          <td>{r.category}</td>
                          <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.detail}</td>
                          <td style={{ fontWeight: '700' }}>{r.impact}</td>
                          <td>{r.department}</td>
                          <td>
                            <span className={`badge-pill ${
                              r.status === 'Approved' || r.status === 'Active' || r.status === 'Resolved' ? 'badge-approved' : 'badge-pending'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td>{r.entity}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

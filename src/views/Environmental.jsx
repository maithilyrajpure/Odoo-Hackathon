import React, { useContext, useState } from 'react';
import { ESGDataContext } from '../context/ESGDataContext';
import { Plus, Search, Calendar, Landmark, Sliders, Settings } from 'lucide-react';

export default function Environmental() {
  const {
    emissionFactors,
    products,
    carbonTransactions,
    environmentalGoals,
    departments,
    settings,
    addEmissionFactor,
    addEnvironmentalGoal,
    updateGoalProgress,
    logEmissionsTransaction
  } = useContext(ESGDataContext);

  const [activeSubTab, setActiveSubTab] = useState('goals'); // Default matches excalidraw mockup: Environmental Goals
  const [searchTerm, setSearchTerm] = useState('');

  // Modals / forms visibility
  const [showAddFactor, setShowAddFactor] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showProgressUpdate, setShowProgressUpdate] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [progressValue, setProgressValue] = useState('');

  // Form states
  const [factorForm, setFactorForm] = useState({ name: '', category: 'Electricity', co2PerUnit: '', unit: 'kWh' });
  const [goalForm, setGoalForm] = useState({ name: '', department: 'Manufacturing', targetCo2: '', deadline: '' });
  const [erpForm, setErpForm] = useState({
    opType: 'Logistics / Delivery (Fleet)',
    factorId: '',
    quantity: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
    manualCo2: ''
  });

  const getOpCategoryAndUnit = (opType) => {
    switch (opType) {
      case 'Utility Billing (Electricity)':
        return { category: 'Electricity', defaultFactor: 'Grid Electricity' };
      case 'Facility Heating (Natural Gas)':
        return { category: 'Heating', defaultFactor: 'Natural Gas' };
      case 'Business Travel (Air Travel)':
        return { category: 'Business Travel', defaultFactor: 'Air Travel (Short Haul)' };
      default:
        return { category: 'Fleet Fuel', defaultFactor: 'Diesel fuel (Fleet)' };
    }
  };

  const { category: currentCategory } = getOpCategoryAndUnit(erpForm.opType);
  const filteredFactors = emissionFactors.filter(f => f.category === currentCategory);
  
  React.useEffect(() => {
    if (filteredFactors.length > 0 && !filteredFactors.some(f => f.id === erpForm.factorId)) {
      setErpForm(prev => ({ ...prev, factorId: filteredFactors[0].id }));
    }
  }, [erpForm.opType, emissionFactors]);

  React.useEffect(() => {
    if (departments.length > 0 && !erpForm.department) {
      setErpForm(prev => ({ ...prev, department: departments[0].name }));
    }
  }, [departments]);

  // Exporters
  const handleExportCsv = (data, filename) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    // Build headers
    const headers = Object.keys(data[0] || {}).join(",");
    csvContent += headers + "\r\n";
    // Build rows
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

  // Submit handers
  const onSubmitFactor = (e) => {
    e.preventDefault();
    if (!factorForm.name || !factorForm.co2PerUnit) return;
    addEmissionFactor(factorForm.name, factorForm.category, factorForm.co2PerUnit, factorForm.unit);
    setShowAddFactor(false);
    setFactorForm({ name: '', category: 'Electricity', co2PerUnit: '', unit: 'kWh' });
  };

  const onSubmitGoal = (e) => {
    e.preventDefault();
    if (!goalForm.name || !goalForm.targetCo2 || !goalForm.deadline) return;
    addEnvironmentalGoal(goalForm.name, goalForm.department, goalForm.targetCo2, goalForm.deadline);
    setShowAddGoal(false);
    setGoalForm({ name: '', department: 'Manufacturing', targetCo2: '', deadline: '' });
  };

  const onSubmitProgress = (e) => {
    e.preventDefault();
    if (!selectedGoalId || !progressValue) return;
    updateGoalProgress(selectedGoalId, progressValue);
    setShowProgressUpdate(false);
    setSelectedGoalId('');
    setProgressValue('');
  };

  const onSubmitErp = async (e) => {
    e.preventDefault();
    if (!erpForm.factorId || !erpForm.quantity || !erpForm.department) return;
    
    let ledgerType = 'Fleet';
    if (erpForm.opType === 'Utility Billing (Electricity)') ledgerType = 'Electricity';
    else if (erpForm.opType === 'Facility Heating (Natural Gas)') ledgerType = 'Heating';
    else if (erpForm.opType === 'Business Travel (Air Travel)') ledgerType = 'Travel';

    await logEmissionsTransaction(
      ledgerType,
      parseFloat(erpForm.quantity),
      erpForm.factorId,
      erpForm.date,
      erpForm.department,
      erpForm.manualCo2
    );

    setErpForm(prev => ({
      ...prev,
      quantity: '',
      manualCo2: ''
    }));
    setActiveSubTab('transactions');
  };

  // Filters
  const filteredGoals = environmentalGoals.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = carbonTransactions.filter(t => 
    t.emissionFactorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-title-container">
          <h1>Environmental: Emission Tracking & Goals</h1>
          <p>Configure emissions factors, inspect carbon logs, and monitor reduction targets</p>
        </div>
      </div>

      {/* Horizontal Sub tabs */}
      <div className="tabs-container">
        <button 
          className={`tab-btn environmental ${activeSubTab === 'erp' ? 'active' : ''}`}
          onClick={() => { setActiveSubTab('erp'); setSearchTerm(''); }}
        >
          ERP Operations Logger
        </button>
        <button 
          className={`tab-btn environmental ${activeSubTab === 'factors' ? 'active' : ''}`}
          onClick={() => { setActiveSubTab('factors'); setSearchTerm(''); }}
        >
          Emission Factors
        </button>
        <button 
          className={`tab-btn environmental ${activeSubTab === 'products' ? 'active' : ''}`}
          onClick={() => { setActiveSubTab('products'); setSearchTerm(''); }}
        >
          Product ESG Profiles
        </button>
        <button 
          className={`tab-btn environmental ${activeSubTab === 'transactions' ? 'active' : ''}`}
          onClick={() => { setActiveSubTab('transactions'); setSearchTerm(''); }}
        >
          Carbon Transactions
        </button>
        <button 
          className={`tab-btn environmental ${activeSubTab === 'goals' ? 'active' : ''}`}
          onClick={() => { setActiveSubTab('goals'); setSearchTerm(''); }}
        >
          Environmental Goals
        </button>
      </div>

      {/* Sub tab contents: 0. ERP Operations Logger */}
      {activeSubTab === 'erp' && (
        <div className="panel-card" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div className="panel-header" style={{ marginBottom: '20px' }}>
            <div className="panel-title">ERP Operations Carbon Logger</div>
          </div>
          <form onSubmit={onSubmitErp}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Business Operation / Activity</label>
                <select 
                  className="form-select"
                  value={erpForm.opType}
                  onChange={(e) => setErpForm(prev => ({ ...prev, opType: e.target.value }))}
                >
                  <option value="Logistics / Delivery (Fleet)">Logistics / Delivery (Fleet)</option>
                  <option value="Utility Billing (Electricity)">Utility Billing (Electricity)</option>
                  <option value="Facility Heating (Natural Gas)">Facility Heating (Natural Gas)</option>
                  <option value="Business Travel (Air Travel)">Business Travel (Air Travel)</option>
                </select>
              </div>

              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
                <div className="form-group">
                  <label>Assign Department</label>
                  <select 
                    className="form-select"
                    value={erpForm.department}
                    onChange={(e) => setErpForm(prev => ({ ...prev, department: e.target.value }))}
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Activity Date</label>
                  <input 
                    type="date" 
                    className="form-input"
                    required
                    value={erpForm.date}
                    onChange={(e) => setErpForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
                <div className="form-group">
                  <label>Select Emission Factor</label>
                  <select 
                    className="form-select"
                    value={erpForm.factorId}
                    onChange={(e) => setErpForm(prev => ({ ...prev, factorId: e.target.value }))}
                  >
                    {filteredFactors.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.co2_per_unit} kg CO2/{f.unit})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Logged Raw Quantity ({filteredFactors[0]?.unit || 'Units'})</label>
                  <input 
                    type="number" 
                    step="any"
                    className="form-input" 
                    placeholder="e.g. 1200"
                    required
                    value={erpForm.quantity}
                    onChange={(e) => setErpForm(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
              </div>

              {/* Eco-Calculation Live Panel */}
              <div style={{
                background: 'rgba(46, 204, 113, 0.08)',
                border: '1px solid rgba(46, 204, 113, 0.2)',
                borderRadius: '10px',
                padding: '16px',
                color: '#fff',
                fontSize: '0.9rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ fontWeight: '700', color: 'var(--color-env)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sliders size={16} /> Eco-Calculation Engine
                </div>
                {settings.autoEmissionCalc ? (
                  <div>
                    {filteredFactors.find(f => f.id === erpForm.factorId) && erpForm.quantity ? (
                      <span>
                        Eco-Calculation: <strong style={{ color: 'var(--color-env)' }}>{parseFloat(erpForm.quantity).toLocaleString()}</strong> {filteredFactors.find(f => f.id === erpForm.factorId)?.unit} × <strong style={{ color: 'var(--color-env)' }}>{filteredFactors.find(f => f.id === erpForm.factorId)?.co2_per_unit}</strong> factor = <strong style={{ color: 'var(--color-env)', fontSize: '1.05rem' }}>{(parseFloat(erpForm.quantity) * filteredFactors.find(f => f.id === erpForm.factorId)?.co2_per_unit).toFixed(2)}</strong> kg CO₂e
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Enter operation details to view live carbon footprint calculations.</span>
                    )}
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-secondary)' }}>
                    Auto-Calculation is disabled. Please enter manual CO₂ equivalent calculation below.
                  </div>
                )}
              </div>

              {/* Manual entry field when auto calculate is off */}
              {!settings.autoEmissionCalc && (
                <div className="form-group">
                  <label>Manual CO₂ equivalent (kg CO₂e)</label>
                  <input 
                    type="number"
                    step="any"
                    className="form-input"
                    placeholder="Enter manual CO2 value"
                    required
                    value={erpForm.manualCo2}
                    onChange={(e) => setErpForm(prev => ({ ...prev, manualCo2: e.target.value }))}
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', width: '100%' }}>
                Process & Log to Carbon Ledger
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub tab contents: 1. Environmental Goals */}
      {activeSubTab === 'goals' && (
        <div className="panel-card">
          <div className="action-bar">
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={() => setShowAddGoal(true)}>
                <Plus size={16} /> New Goal
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  const activeGoal = environmentalGoals[0];
                  if (activeGoal) {
                    setSelectedGoalId(activeGoal.id);
                    setProgressValue(activeGoal.currentCo2);
                    setShowProgressUpdate(true);
                  } else {
                    alert("Please create a goal first.");
                  }
                }}
              >
                Update Progress
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => handleExportCsv(environmentalGoals, "environmental_goals")}
              >
                Export CSV
              </button>
            </div>

            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input 
                type="text" 
                className="form-input search-input" 
                placeholder="Search goals..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="esg-table">
              <thead>
                <tr>
                  <th>Goal Name</th>
                  <th>Department</th>
                  <th>Target CO₂ (kg)</th>
                  <th>Current CO₂ (kg)</th>
                  <th>Progress</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredGoals.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No environmental goals found.</td>
                  </tr>
                ) : (
                  filteredGoals.map((g) => {
                    const progress = g.targetCo2 > 0 ? Math.min(Math.round((g.currentCo2 / g.targetCo2) * 100), 100) : 0;
                    return (
                      <tr key={g.id}>
                        <td style={{ fontWeight: '600' }}>{g.name}</td>
                        <td>{g.department}</td>
                        <td>{g.targetCo2.toLocaleString()}</td>
                        <td>{g.currentCo2.toLocaleString()}</td>
                        <td>
                          <div className="progress-bar-container">
                            <div className="progress-track">
                              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="progress-label">{progress}%</span>
                          </div>
                        </td>
                        <td>{g.deadline}</td>
                        <td>
                          <span className={`badge-pill ${
                            g.status === 'Completed' ? 'badge-approved' : 
                            g.status === 'On Track' ? 'badge-ontrack' : 'badge-pending'
                          }`}>
                            {g.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub tab contents: 2. Emission Factors */}
      {activeSubTab === 'factors' && (
        <div className="panel-card">
          <div className="action-bar">
            <button className="btn btn-primary" onClick={() => setShowAddFactor(true)}>
              <Plus size={16} /> New Factor
            </button>
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input 
                type="text" 
                className="form-input search-input" 
                placeholder="Search factors..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="esg-table">
              <thead>
                <tr>
                  <th>Factor Name</th>
                  <th>Category</th>
                  <th>CO₂ equivalent / Unit</th>
                  <th>Operational Unit</th>
                </tr>
              </thead>
              <tbody>
                {emissionFactors.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).map((f) => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: '600' }}>{f.name}</td>
                    <td>{f.category}</td>
                    <td>{f.co2PerUnit} kg CO2e</td>
                    <td>{f.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub tab contents: 3. Product ESG Profiles */}
      {activeSubTab === 'products' && (
        <div className="panel-card">
          <div className="table-container">
            <table className="esg-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Carbon Footprint (kg CO₂e/unit)</th>
                  <th>Recyclability Rating</th>
                  <th>Material Sourcing</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: '600' }}>{p.name}</td>
                    <td>{p.carbonFootprint} kg</td>
                    <td>
                      <div className="progress-bar-container">
                        <div className="progress-track" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                          <div className="progress-bar" style={{ width: `${p.recyclability}%`, background: 'var(--color-soc)' }}></div>
                        </div>
                        <span className="progress-label">{p.recyclability}%</span>
                      </div>
                    </td>
                    <td>{p.materialSource}</td>
                    <td>
                      <span className="badge-pill badge-active">{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub tab contents: 4. Carbon Transactions */}
      {activeSubTab === 'transactions' && (
        <div className="panel-card">
          <div className="action-bar">
            <button 
              className="btn btn-secondary"
              onClick={() => handleExportCsv(carbonTransactions, "carbon_ledger")}
            >
              Export CSV Ledger
            </button>
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input 
                type="text" 
                className="form-input search-input" 
                placeholder="Search ledger..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="esg-table">
              <thead>
                <tr>
                  <th>Transaction Date</th>
                  <th>Log Type</th>
                  <th>Logged Quantity</th>
                  <th>Unit</th>
                  <th>Factor Mapping</th>
                  <th>CO₂ equivalent (kg)</th>
                  <th>Logging Department</th>
                  <th>Ledger Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No carbon ledger transactions registered.</td>
                  </tr>
                ) : (
                  filteredTransactions.map((t) => (
                    <tr key={t.id}>
                      <td>{t.date}</td>
                      <td>
                        <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{t.type}</span>
                      </td>
                      <td>{t.quantity.toLocaleString()}</td>
                      <td>{t.unit}</td>
                      <td>{t.emissionFactorName}</td>
                      <td style={{ color: 'var(--color-env)', fontWeight: '600' }}>{t.co2Value.toLocaleString()} kg</td>
                      <td>{t.department}</td>
                      <td>
                        <span className="badge-pill badge-approved">{t.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Goal */}
      {showAddGoal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Define New Sustainability Goal</h3>
              <button className="modal-close-btn" onClick={() => setShowAddGoal(false)}>✕</button>
            </div>
            <form onSubmit={onSubmitGoal}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>Goal Target Description</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Cut Office Energy Consumptions"
                      required
                      value={goalForm.name}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
                    <div className="form-group">
                      <label>Target CO₂ Reduction (kg)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="e.g. 500"
                        required
                        value={goalForm.targetCo2}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, targetCo2: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Department Ownership</label>
                      <select 
                        className="form-select"
                        value={goalForm.department}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, department: e.target.value }))}
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Target Deadline</label>
                    <input 
                      type="date" 
                      className="form-input"
                      required
                      value={goalForm.deadline}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddGoal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Define Target</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Emission Factor */}
      {showAddFactor && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Add Carbon Emission Factor</h3>
              <button className="modal-close-btn" onClick={() => setShowAddFactor(false)}>✕</button>
            </div>
            <form onSubmit={onSubmitFactor}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>Emission Factor Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Coal Powered Generator"
                      required
                      value={factorForm.name}
                      onChange={(e) => setFactorForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Resource Category</label>
                    <select 
                      className="form-select"
                      value={factorForm.category}
                      onChange={(e) => setFactorForm(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="Electricity">Electricity</option>
                      <option value="Fleet Fuel">Fleet Fuel</option>
                      <option value="Heating">Heating</option>
                      <option value="Business Travel">Business Travel</option>
                    </select>
                  </div>
                  <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
                    <div className="form-group">
                      <label>CO₂ Equivalent / Unit (kg)</label>
                      <input 
                        type="number" 
                        step="any"
                        className="form-input" 
                        placeholder="e.g. 1.25"
                        required
                        value={factorForm.co2PerUnit}
                        onChange={(e) => setFactorForm(prev => ({ ...prev, co2PerUnit: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Operational Unit</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. kWh, Liters, kg"
                        required
                        value={factorForm.unit}
                        onChange={(e) => setFactorForm(prev => ({ ...prev, unit: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddFactor(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Factor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Goal Progress */}
      {showProgressUpdate && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Update Goal Progress</h3>
              <button className="modal-close-btn" onClick={() => setShowProgressUpdate(false)}>✕</button>
            </div>
            <form onSubmit={onSubmitProgress}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>Select Target Goal</label>
                    <select 
                      className="form-select"
                      value={selectedGoalId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setSelectedGoalId(id);
                        const match = environmentalGoals.find(g => g.id === id);
                        if (match) setProgressValue(match.currentCo2);
                      }}
                    >
                      {environmentalGoals.map(g => (
                        <option key={g.id} value={g.id}>{g.name} ({g.department})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Current Cumulative Progress (CO₂ kg reduction achieved)</label>
                    <input 
                      type="number" 
                      className="form-input"
                      required
                      placeholder="Enter new current score value"
                      value={progressValue}
                      onChange={(e) => setProgressValue(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProgressUpdate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Progress</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

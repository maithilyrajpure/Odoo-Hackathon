import React, { createContext, useState, useEffect } from 'react';

export const ESGDataContext = createContext();

// Predefined mock data for seeding the virtual database
const initialDepartments = [
  { id: '1', name: 'Manufacturing', code: 'MFC', head: 'S. Nair', parentDept: '—', employees: 134, status: 'Active' },
  { id: '2', name: 'Logistics', code: 'LOC', head: 'R. Iyer', parentDept: 'Manufacturing', employees: 58, status: 'Active' },
  { id: '3', name: 'Corporate', code: 'COF', head: 'A. Mehta', parentDept: '—', employees: 41, status: 'Active' },
  { id: '4', name: 'Sales', code: 'SAL', head: 'M. Sharma', parentDept: 'Corporate', employees: 85, status: 'Active' },
  { id: '5', name: 'R&D', code: 'RND', head: 'Dr. A. Patel', parentDept: '—', employees: 25, status: 'Active' },
];

const initialCategories = [
  { id: '1', name: 'Carbon Accounting', type: 'Environmental', status: 'Active' },
  { id: '2', name: 'Waste Management', type: 'Environmental', status: 'Active' },
  { id: '3', name: 'CSR Activity', type: 'Social', status: 'Active' },
  { id: '4', name: 'Sustainability Challenge', type: 'Social', status: 'Active' },
  { id: '5', name: 'Governance Audits', type: 'Governance', status: 'Active' },
  { id: '6', name: 'Corporate Policies', type: 'Governance', status: 'Active' },
];

const initialEmissionFactors = [
  { id: '1', name: 'Grid Electricity', category: 'Electricity', co2PerUnit: 0.85, unit: 'kWh' },
  { id: '2', name: 'Diesel fuel (Fleet)', category: 'Fleet Fuel', co2PerUnit: 2.68, unit: 'Liters' },
  { id: '3', name: 'Natural Gas', category: 'Heating', co2PerUnit: 1.89, unit: 'm³' },
  { id: '4', name: 'Air Travel (Short Haul)', category: 'Business Travel', co2PerUnit: 0.15, unit: 'km' },
];

const initialProducts = [
  { id: '1', name: 'EcoPack Cardboard Box', carbonFootprint: 0.12, recyclability: 100, materialSource: 'Recycled Pulp', status: 'Active' },
  { id: '2', name: 'Standard Plastic Shrink', carbonFootprint: 0.89, recyclability: 30, materialSource: 'Petroleum Base', status: 'Active' },
  { id: '3', name: 'Biodegradable Packing Peanuts', carbonFootprint: 0.05, recyclability: 95, materialSource: 'Corn Starch', status: 'Active' },
];

const initialEnvironmentalGoals = [
  { id: '1', name: 'Reduce Fleet Emissions', department: 'Logistics', targetCo2: 500, currentCo2: 350, deadline: '2026-12-31', status: 'Active' },
  { id: '2', name: 'Cut Packaging Waste', department: 'Manufacturing', targetCo2: 120, currentCo2: 98, deadline: '2026-09-30', status: 'On Track' },
  { id: '3', name: 'Office Energy Cut', department: 'Corporate', targetCo2: 80, currentCo2: 80, deadline: '2026-06-30', status: 'Completed' },
];

const initialPolicies = [
  { id: '1', title: 'Anti-Corruption Policy', category: 'Ethics & Compliance', content: 'Our code of conduct requires strict compliance with global anti-bribery standards. No employee may offer, request, or receive bribes of any nature.', version: 'v2.1', effectiveDate: '2026-01-01', status: 'Published' },
  { id: '2', title: 'Supplier Code of Conduct', category: 'Supply Chain', content: 'All suppliers must guarantee fair wages, safe working environments, and document zero usage of forced labor or child labor.', version: 'v1.4', effectiveDate: '2026-03-15', status: 'Published' },
  { id: '3', title: 'Carbon Neutrality Roadmap', category: 'Environmental', content: 'EcoSphere commits to a 50% carbon reduction in Scope 1 and Scope 2 emissions by 2030, with net zero operations target by 2035.', version: 'v1.0', effectiveDate: '2026-05-01', status: 'Published' },
];

const initialBadges = [
  { id: '1', name: 'Green Beginner', description: 'Awarded for completing your first sustainability challenge.', unlockRule: 'Complete 1 Challenge', icon: '🌱' },
  { id: '2', name: 'Carbon Saver', description: 'Awarded for logging emissions reduction of 500kg or more.', unlockRule: 'Reduce 500kg CO2', icon: '🔋' },
  { id: '3', name: 'Sustainability Champion', description: 'Awarded for earning more than 5,000 total XP.', unlockRule: 'Reach 5000 XP', icon: '🏆' },
  { id: '4', name: 'Team Player', description: 'Awarded for participating in 3 or more CSR activities.', unlockRule: 'Participate in 3 CSR Activities', icon: '🤝' },
];

const initialRewards = [
  { id: '1', name: 'Eco Coffee Mug', description: 'Double-walled stainless steel reusable coffee mug with EcoSphere branding.', pointsRequired: 50, stock: 8, status: 'Available' },
  { id: '2', name: 'Tree Planting Certificate', description: 'We will plant a native tree in your name in the local forest reserve.', pointsRequired: 100, stock: 999, status: 'Available' },
  { id: '3', name: 'Organic Cotton Tote', description: 'Spacious, heavy-duty organic cotton tote bag for sustainable shopping.', pointsRequired: 75, stock: 15, status: 'Available' },
  { id: '4', name: 'Wellness Session Pass', description: 'Voucher for a 60-minute virtual yoga or mental wellness session.', pointsRequired: 200, stock: 3, status: 'Available' },
];

const initialCarbonTransactions = [
  { id: '1', date: '2026-07-01', type: 'Fleet', quantity: 150, unit: 'Liters', emissionFactorName: 'Diesel fuel (Fleet)', co2Value: 402.0, status: 'Active', department: 'Logistics' },
  { id: '2', date: '2026-07-03', type: 'Purchase', quantity: 2400, unit: 'kWh', emissionFactorName: 'Grid Electricity', co2Value: 2040.0, status: 'Active', department: 'Manufacturing' },
  { id: '3', date: '2026-07-05', type: 'Manufacturing', quantity: 300, unit: 'm³', emissionFactorName: 'Natural Gas', co2Value: 567.0, status: 'Active', department: 'Manufacturing' },
  { id: '4', date: '2026-07-08', type: 'Expenses', quantity: 800, unit: 'km', emissionFactorName: 'Air Travel (Short Haul)', co2Value: 120.0, status: 'Active', department: 'Sales' },
];

const initialCsrActivities = [
  { id: '1', name: 'Tree Plantation Drive', description: 'Join the annual afforestation campaign in the northern suburbs to restore forest canopy.', points: 50, status: 'Active', evidenceRequired: true },
  { id: '2', name: 'Blood Donation Camp', description: 'Support our quarterly blood drive hosted in partnership with Red Cross in the cafeteria.', points: 30, status: 'Active', evidenceRequired: true },
  { id: '3', name: 'Beach Cleanup', description: 'Spend Saturday morning cleaning plastics and waste from the city shoreline.', points: 40, status: 'Active', evidenceRequired: false },
  { id: '4', name: 'ESG Corporate Workshop', description: 'Participate in the compliance training and sustainable operational standards seminar.', points: 20, status: 'Active', evidenceRequired: false },
];

const initialEmployeeParticipations = [
  { id: '1', employee: 'Aditi Rao', activityName: 'Tree Plantation Drive', proof: 'tree_planting_selfie.jpg', pointsEarned: 50, status: 'Pending', date: '2026-07-10', department: 'Manufacturing' },
  { id: '2', employee: 'Karan Shah', activityName: 'ESG Corporate Workshop', proof: 'cert.pdf', pointsEarned: 20, status: 'Approved', date: '2026-07-08', department: 'Logistics' },
  { id: '3', employee: 'Priya Sharma', activityName: 'Beach Cleanup', proof: 'none', pointsEarned: 40, status: 'Approved', date: '2026-07-09', department: 'Corporate' },
];

const initialChallenges = [
  { id: '1', title: 'Sustainability Sprint', category: 'Carbon reduction', description: 'Cut your monthly operational carbon footprint by 10% through conscious energy consumption.', xp: 200, difficulty: 'Hard', evidenceRequired: true, deadline: '2026-07-20', status: 'Active' },
  { id: '2', title: 'Recycle Challenge', category: 'Waste sorting', description: 'Properly categorize office waste. Share a short note showing how your team achieved zero-waste desk spaces.', xp: 80, difficulty: 'Easy', evidenceRequired: true, deadline: '2026-07-15', status: 'Active' },
  { id: '3', title: 'Commute Green Week', category: 'Transport', description: 'Avoid single-passenger vehicles for your commute. Work from home, carpool, bike, or use transit.', xp: 120, difficulty: 'Medium', evidenceRequired: false, deadline: '2026-07-25', status: 'Draft' },
];

const initialChallengeParticipations = [
  { id: '1', challengeTitle: 'Recycle Challenge', employee: 'Priya Sharma', progress: 100, proof: 'recycling_bin.jpg', status: 'Approved', xpAwarded: 80, date: '2026-07-11' },
  { id: '2', challengeTitle: 'Sustainability Sprint', employee: 'Aditi Rao', progress: 60, proof: 'energy_log.xlsx', status: 'Under Review', xpAwarded: 0, date: '2026-07-12' },
];

const initialPolicyAcknowledgements = [
  { id: '1', policyTitle: 'Anti-Corruption Policy', employee: 'Aditi Rao', date: '2026-06-15' },
  { id: '2', policyTitle: 'Anti-Corruption Policy', employee: 'Karan Shah', date: '2026-06-16' },
  { id: '3', policyTitle: 'Supplier Code of Conduct', employee: 'Aditi Rao', date: '2026-06-18' },
];

const initialAudits = [
  { id: '1', title: 'Q2 Waste Audit', department: 'Manufacturing', auditor: 'S. Nair', date: '2026-06-12', findings: '3 minor compliance discrepancies in scrap segregation.', status: 'Completed' },
  { id: '2', title: 'Vendor Compliance Check', department: 'Logistics', auditor: 'R. Iyer', date: '2026-07-01', findings: '1 unresolved vendor disclosure discrepancy.', status: 'Under Review' },
];

const initialComplianceIssues = [
  { id: '1', auditTitle: 'Q2 Waste Audit', issue: 'Missing MSDS sheets', severity: 'High', department: 'Manufacturing', owner: 'Aditi Rao', dueDate: '2026-07-10', status: 'Open' },
  { id: '2', auditTitle: 'Vendor Compliance Check', issue: 'Late vendor disclosure', severity: 'Medium', department: 'Logistics', owner: 'Karan Shah', dueDate: '2026-07-15', status: 'Resolved' },
];

const initialActiveUser = {
  id: 'u1',
  name: 'Aditi Rao',
  role: 'Employee',
  department: 'Manufacturing',
  xp: 4820,
  points: 380,
  badges: ['Green Beginner', 'Team Player'],
};

const initialUsersList = [
  { id: 'u1', name: 'Aditi Rao', role: 'Employee', department: 'Manufacturing', xp: 4820, points: 380, badges: ['Green Beginner', 'Team Player'] },
  { id: 'u2', name: 'S. Nair', role: 'Manager', department: 'Manufacturing', xp: 5200, points: 600, badges: ['Sustainability Champion'] },
  { id: 'u3', name: 'Karan Shah', role: 'Employee', department: 'Logistics', xp: 3910, points: 210, badges: ['Green Beginner'] },
  { id: 'u4', name: 'R. Iyer', role: 'Manager', department: 'Logistics', xp: 4100, points: 350, badges: ['Team Player'] },
];

export const ESGDataProvider = ({ children }) => {
  // Database States loaded from LocalStorage if they exist, else using mock seeds
  const [departments, setDepartments] = useState(() => JSON.parse(localStorage.getItem('esg_departments')) || initialDepartments);
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('esg_categories')) || initialCategories);
  const [emissionFactors, setEmissionFactors] = useState(() => JSON.parse(localStorage.getItem('esg_emissionFactors')) || initialEmissionFactors);
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('esg_products')) || initialProducts);
  const [environmentalGoals, setEnvironmentalGoals] = useState(() => JSON.parse(localStorage.getItem('esg_environmentalGoals')) || initialEnvironmentalGoals);
  const [policies, setPolicies] = useState(() => JSON.parse(localStorage.getItem('esg_policies')) || initialPolicies);
  const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem('esg_badges')) || initialBadges);
  const [rewards, setRewards] = useState(() => JSON.parse(localStorage.getItem('esg_rewards')) || initialRewards);
  const [carbonTransactions, setCarbonTransactions] = useState(() => JSON.parse(localStorage.getItem('esg_carbonTransactions')) || initialCarbonTransactions);
  const [csrActivities, setCsrActivities] = useState(() => JSON.parse(localStorage.getItem('esg_csrActivities')) || initialCsrActivities);
  const [employeeParticipations, setEmployeeParticipations] = useState(() => JSON.parse(localStorage.getItem('esg_employeeParticipations')) || initialEmployeeParticipations);
  const [challenges, setChallenges] = useState(() => JSON.parse(localStorage.getItem('esg_challenges')) || initialChallenges);
  const [challengeParticipations, setChallengeParticipations] = useState(() => JSON.parse(localStorage.getItem('esg_challengeParticipations')) || initialChallengeParticipations);
  const [policyAcknowledgements, setPolicyAcknowledgements] = useState(() => JSON.parse(localStorage.getItem('esg_policyAcknowledgements')) || initialPolicyAcknowledgements);
  const [audits, setAudits] = useState(() => JSON.parse(localStorage.getItem('esg_audits')) || initialAudits);
  const [complianceIssues, setComplianceIssues] = useState(() => JSON.parse(localStorage.getItem('esg_complianceIssues')) || initialComplianceIssues);
  const [activeUser, setActiveUser] = useState(() => JSON.parse(localStorage.getItem('esg_activeUser')) || initialActiveUser);
  const [usersList, setUsersList] = useState(() => JSON.parse(localStorage.getItem('esg_usersList')) || initialUsersList);
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('esg_notifications')) || [
    { id: 1, type: 'info', message: 'Welcome to EcoSphere ESG Platform!', date: new Date().toLocaleDateString() }
  ]);

  // System Configuration (Settings tab toggles)
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('esg_settings')) || {
    autoEmissionCalc: true,
    requireCSRevidence: true,
    autoAwardBadges: true,
    emailAlerts: true,
  });

  // Save all databases back to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('esg_departments', JSON.stringify(departments));
  }, [departments]);
  useEffect(() => {
    localStorage.setItem('esg_categories', JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem('esg_emissionFactors', JSON.stringify(emissionFactors));
  }, [emissionFactors]);
  useEffect(() => {
    localStorage.setItem('esg_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('esg_environmentalGoals', JSON.stringify(environmentalGoals));
  }, [environmentalGoals]);
  useEffect(() => {
    localStorage.setItem('esg_policies', JSON.stringify(policies));
  }, [policies]);
  useEffect(() => {
    localStorage.setItem('esg_badges', JSON.stringify(badges));
  }, [badges]);
  useEffect(() => {
    localStorage.setItem('esg_rewards', JSON.stringify(rewards));
  }, [rewards]);
  useEffect(() => {
    localStorage.setItem('esg_carbonTransactions', JSON.stringify(carbonTransactions));
  }, [carbonTransactions]);
  useEffect(() => {
    localStorage.setItem('esg_csrActivities', JSON.stringify(csrActivities));
  }, [csrActivities]);
  useEffect(() => {
    localStorage.setItem('esg_employeeParticipations', JSON.stringify(employeeParticipations));
  }, [employeeParticipations]);
  useEffect(() => {
    localStorage.setItem('esg_challenges', JSON.stringify(challenges));
  }, [challenges]);
  useEffect(() => {
    localStorage.setItem('esg_challengeParticipations', JSON.stringify(challengeParticipations));
  }, [challengeParticipations]);
  useEffect(() => {
    localStorage.setItem('esg_policyAcknowledgements', JSON.stringify(policyAcknowledgements));
  }, [policyAcknowledgements]);
  useEffect(() => {
    localStorage.setItem('esg_audits', JSON.stringify(audits));
  }, [audits]);
  useEffect(() => {
    localStorage.setItem('esg_complianceIssues', JSON.stringify(complianceIssues));
  }, [complianceIssues]);
  useEffect(() => {
    localStorage.setItem('esg_activeUser', JSON.stringify(activeUser));
  }, [activeUser]);
  useEffect(() => {
    localStorage.setItem('esg_usersList', JSON.stringify(usersList));
  }, [usersList]);
  useEffect(() => {
    localStorage.setItem('esg_settings', JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem('esg_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handle switching active users
  const switchUser = (userId) => {
    const matchedUser = usersList.find(u => u.id === userId);
    if (matchedUser) {
      setActiveUser(matchedUser);
      addNotification('info', `Switched active profile to ${matchedUser.name} (${matchedUser.role}).`);
    }
  };

  // Push system notification helper
  const addNotification = (type, message) => {
    const newNotif = {
      id: Date.now(),
      type,
      message,
      date: new Date().toLocaleDateString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Add standard user action logger or trigger auto alert functions
  const awardUserXp = (amount) => {
    setActiveUser(prev => {
      const nextXp = prev.xp + amount;
      const nextPoints = prev.points + amount; // 1 XP = 1 Point (re-deemable)
      const earnedBadges = [...prev.badges];

      // Auto Badge checks
      if (settings.autoAwardBadges) {
        if (nextXp >= 5000 && !earnedBadges.includes('Sustainability Champion')) {
          earnedBadges.push('Sustainability Champion');
          addNotification('badge', 'Congratulations! You unlocked the "Sustainability Champion" Badge! 🏆');
        }
      }

      return {
        ...prev,
        xp: nextXp,
        points: nextPoints,
        badges: earnedBadges,
      };
    });
  };

  // Add custom helper function to update department scores dynamically
  const getDepartmentScores = (deptName) => {
    // 1. Environmental Score: starts at 100
    // Deduct points based on carbon transactions relative to employees, reward based on goal completion
    const deptEmissions = carbonTransactions
      .filter(t => t.department === deptName && t.status === 'Active')
      .reduce((sum, t) => sum + t.co2Value, 0);

    const deptGoals = environmentalGoals.filter(g => g.department === deptName);
    let goalCompletionSum = 0;
    deptGoals.forEach(g => {
      const prog = g.targetCo2 > 0 ? (g.currentCo2 / g.targetCo2) * 100 : 0;
      if (g.status === 'Completed') goalCompletionSum += 100;
      else if (g.status === 'On Track') goalCompletionSum += 80;
      else goalCompletionSum += Math.min(prog, 100);
    });
    const avgGoalProgress = deptGoals.length > 0 ? goalCompletionSum / deptGoals.length : 90; // Default baseline if no goals

    const emissionDeduction = Math.min((deptEmissions / 100), 40); // cap environmental penalty at 40 points
    const calculatedEnvScore = Math.max(Math.round(avgGoalProgress * 0.7 + (100 - emissionDeduction) * 0.3), 0);

    // 2. Social Score: starts at 50
    // Based on completed challenges and approved CSR activity participations
    const deptEmployeesCount = departments.find(d => d.name === deptName)?.employees || 10;
    const approvedCSRsCount = employeeParticipations.filter(p => p.department === deptName && p.status === 'Approved').length;
    const completedChallengesCount = challengeParticipations.filter(p => {
      // Find employee's department (Mock matching: Aditi = Manufacturing, Karan = Logistics, Priya = Corporate)
      const empDept = p.employee === 'Aditi Rao' ? 'Manufacturing' : p.employee === 'Karan Shah' ? 'Logistics' : 'Corporate';
      return empDept === deptName && p.status === 'Approved';
    }).length;

    const participationRate = Math.min(((approvedCSRsCount + completedChallengesCount) / deptEmployeesCount) * 100, 100);
    const calculatedSocScore = Math.min(Math.round(50 + participationRate * 0.5), 100);

    // 3. Governance Score: starts at 100
    // Deduct heavily for unresolved open compliance issues
    const deptOpenIssues = complianceIssues.filter(i => i.department === deptName && i.status === 'Open').length;
    const auditStatusCount = audits.filter(a => a.department === deptName && a.status === 'Completed').length;
    const calculatedGovScore = Math.max(Math.min(100 - (deptOpenIssues * 15) + (auditStatusCount * 5), 100), 0);

    // 4. Combined weighted total
    const weightedTotal = Math.round(
      (calculatedEnvScore * 0.40) + 
      (calculatedSocScore * 0.30) + 
      (calculatedGovScore * 0.30)
    );

    return {
      environmental: calculatedEnvScore,
      social: calculatedSocScore,
      governance: calculatedGovScore,
      total: weightedTotal,
    };
  };

  // Compile calculations for all departments to feed the Overall Org Score
  const getOverallESGScore = () => {
    let envSum = 0, socSum = 0, govSum = 0, totalSum = 0;
    const activeDepts = departments.filter(d => d.status === 'Active');

    activeDepts.forEach(d => {
      const scores = getDepartmentScores(d.name);
      envSum += scores.environmental;
      socSum += scores.social;
      govSum += scores.governance;
      totalSum += scores.total;
    });

    const count = activeDepts.length || 1;
    return {
      environmental: Math.round(envSum / count),
      social: Math.round(socSum / count),
      governance: Math.round(govSum / count),
      total: Math.round(totalSum / count),
    };
  };

  // --- ACTIONS ---

  // 1. Environmental Actions
  const logEmissionsTransaction = (type, quantity, factorId, customDate, deptName) => {
    const factor = emissionFactors.find(f => f.id === factorId);
    if (!factor) return;
    const co2 = parseFloat((quantity * factor.co2PerUnit).toFixed(2));

    const newTransaction = {
      id: String(Date.now()),
      date: customDate || new Date().toISOString().split('T')[0],
      type,
      quantity: parseFloat(quantity),
      unit: factor.unit,
      emissionFactorName: factor.name,
      co2Value: co2,
      status: 'Active',
      department: deptName || activeUser.department,
    };

    setCarbonTransactions(prev => [newTransaction, ...prev]);
    addNotification('environmental', `New ${type} emissions log registered: ${co2} kg CO2e.`);

    // If active user is logging, award XP
    if (activeUser.name) {
      awardUserXp(10);
    }
  };

  const addEmissionFactor = (name, category, co2PerUnit, unit) => {
    const newFactor = {
      id: String(Date.now()),
      name,
      category,
      co2PerUnit: parseFloat(co2PerUnit),
      unit
    };
    setEmissionFactors(prev => [...prev, newFactor]);
    addNotification('settings', `Added new emission factor: ${name}.`);
  };

  const addEnvironmentalGoal = (name, department, targetCo2, deadline) => {
    const newGoal = {
      id: String(Date.now()),
      name,
      department,
      targetCo2: parseFloat(targetCo2),
      currentCo2: 0,
      deadline,
      status: 'Active'
    };
    setEnvironmentalGoals(prev => [...prev, newGoal]);
    addNotification('environmental', `New environmental target set for ${department}: "${name}".`);
  };

  const updateGoalProgress = (goalId, currentCo2) => {
    setEnvironmentalGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const parsedCo2 = parseFloat(currentCo2);
      const isCompleted = parsedCo2 >= g.targetCo2;
      return {
        ...g,
        currentCo2: parsedCo2,
        status: isCompleted ? 'Completed' : (parsedCo2 > g.targetCo2 * 0.75 ? 'On Track' : 'Active')
      };
    }));
  };

  // 2. Social Actions
  const addCsrActivity = (name, description, points, evidenceRequired) => {
    const newAct = {
      id: String(Date.now()),
      name,
      description,
      points: parseInt(points),
      status: 'Active',
      evidenceRequired: !!evidenceRequired
    };
    setCsrActivities(prev => [...prev, newAct]);
    addNotification('social', `New CSR Initiative added: "${name}".`);
  };

  const joinCsrActivity = (activityId, employeeName, proofFileName) => {
    const activity = csrActivities.find(a => a.id === activityId);
    if (!activity) return;

    // Verify evidence rule
    if (settings.requireCSRevidence && activity.evidenceRequired && !proofFileName) {
      alert("Error: Proof document is required to submit participation for this CSR Activity.");
      return;
    }

    const newParticipation = {
      id: String(Date.now()),
      employee: employeeName || activeUser.name,
      activityName: activity.name,
      proof: proofFileName || 'No evidence uploaded',
      pointsEarned: activity.points,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      department: activeUser.department,
    };

    setEmployeeParticipations(prev => [newParticipation, ...prev]);
    addNotification('social', `${employeeName || activeUser.name} submitted participation for "${activity.name}".`);
  };

  const approveParticipation = (participationId, approved) => {
    setEmployeeParticipations(prev => prev.map(p => {
      if (p.id !== participationId) return p;

      const nextStatus = approved ? 'Approved' : 'Rejected';
      if (approved) {
        // Award XP to active user if they are the participant
        if (p.employee === activeUser.name) {
          awardUserXp(p.pointsEarned);
        }
        addNotification('social', `Participation approved for ${p.employee} - Earned ${p.pointsEarned} Points.`);

        // Auto Badge Rule Check for CSR activity count
        if (settings.autoAwardBadges && p.employee === activeUser.name) {
          const approvedCount = employeeParticipations.filter(part => part.employee === activeUser.name && part.status === 'Approved').length + 1;
          if (approvedCount >= 3 && !activeUser.badges.includes('Team Player')) {
            setActiveUser(prev => ({
              ...prev,
              badges: [...prev.badges, 'Team Player']
            }));
            addNotification('badge', 'Congratulations! You unlocked the "Team Player" Badge! 🤝');
          }
        }
      } else {
        addNotification('social', `Participation for ${p.employee} was marked Rejected.`);
      }

      return { ...p, status: nextStatus };
    }));
  };

  // 3. Governance Actions
  const acknowledgePolicy = (policyTitle, employeeName) => {
    const user = employeeName || activeUser.name;
    const alreadyAcknowledged = policyAcknowledgements.some(a => a.policyTitle === policyTitle && a.employee === user);
    if (alreadyAcknowledged) return;

    const newAck = {
      id: String(Date.now()),
      policyTitle,
      employee: user,
      date: new Date().toISOString().split('T')[0]
    };

    setPolicyAcknowledgements(prev => [...prev, newAck]);
    addNotification('governance', `Policy Acknowledged: "${policyTitle}" signed by ${user}.`);
    awardUserXp(15);
  };

  const createComplianceIssue = (auditTitle, issue, severity, department, owner, dueDate) => {
    const newIssue = {
      id: String(Date.now()),
      auditTitle,
      issue,
      severity,
      department,
      owner,
      dueDate,
      status: 'Open'
    };

    setComplianceIssues(prev => [newIssue, ...prev]);
    addNotification('governance', `⚠️ NEW COMPLIANCE ISSUE: "${issue}" assigned to ${owner} (Due: ${dueDate})`);
  };

  const resolveComplianceIssue = (issueId) => {
    setComplianceIssues(prev => prev.map(i => {
      if (i.id !== issueId) return i;
      addNotification('governance', `Compliance issue resolved: "${i.issue}".`);
      return { ...i, status: 'Resolved' };
    }));
  };

  // 4. Gamification Actions
  const joinChallenge = (challengeId, employeeName) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const alreadyJoined = challengeParticipations.some(p => p.challengeTitle === challenge.title && p.employee === (employeeName || activeUser.name));
    if (alreadyJoined) return;

    const newPart = {
      id: String(Date.now()),
      challengeTitle: challenge.title,
      employee: employeeName || activeUser.name,
      progress: 0,
      proof: 'none',
      status: 'Joined',
      xpAwarded: 0,
      date: new Date().toISOString().split('T')[0]
    };

    setChallengeParticipations(prev => [newPart, ...prev]);
    addNotification('gamification', `Started challenge: "${challenge.title}"`);
  };

  const submitChallengeProgress = (participationId, progressPct, proofFile) => {
    setChallengeParticipations(prev => prev.map(p => {
      if (p.id !== participationId) return p;

      const chal = challenges.find(c => c.title === p.challengeTitle);
      const isComplete = progressPct >= 100;
      const nextStatus = isComplete ? 'Under Review' : 'Joined';

      return {
        ...p,
        progress: parseInt(progressPct),
        proof: proofFile || 'Details logged',
        status: nextStatus
      };
    }));
  };

  const approveChallengeParticipation = (participationId, approved) => {
    setChallengeParticipations(prev => prev.map(p => {
      if (p.id !== participationId) return p;

      const chal = challenges.find(c => c.title === p.challengeTitle);
      if (!chal) return p;

      const nextStatus = approved ? 'Approved' : 'Rejected';
      if (approved) {
        if (p.employee === activeUser.name) {
          awardUserXp(chal.xp);
        }
        addNotification('gamification', `Challenge Approved! ${p.employee} received ${chal.xp} XP.`);

        // Badge unlock check (Green Beginner badge)
        if (settings.autoAwardBadges && p.employee === activeUser.name) {
          const completedCount = challengeParticipations.filter(part => part.employee === activeUser.name && part.status === 'Approved').length + 1;
          if (completedCount >= 1 && !activeUser.badges.includes('Green Beginner')) {
            setActiveUser(prev => ({
              ...prev,
              badges: [...prev.badges, 'Green Beginner']
            }));
            addNotification('badge', 'Congratulations! You unlocked the "Green Beginner" Badge! 🌱');
          }
        }
      }

      return {
        ...p,
        status: nextStatus,
        xpAwarded: approved ? chal.xp : 0
      };
    }));
  };

  // 5. Rewards Shop
  const redeemReward = (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (reward.stock <= 0) {
      alert("Error: Out of stock!");
      return;
    }

    if (activeUser.points < reward.pointsRequired) {
      alert(`Error: Insufficient points. You need ${reward.pointsRequired} points, but you have ${activeUser.points}.`);
      return;
    }

    // Deduct points, decrement stock
    setRewards(prev => prev.map(r => {
      if (r.id !== rewardId) return r;
      return { ...r, stock: r.stock - 1 };
    }));

    setActiveUser(prev => ({
      ...prev,
      points: prev.points - reward.pointsRequired
    }));

    addNotification('reward', `Redeemed reward: "${reward.name}" (-${reward.pointsRequired} Points).`);
    alert(`Success! You have redeemed "${reward.name}". Check your email for redemption voucher details.`);
  };

  // 6. Settings & Config
  const addDepartment = (name, code, head, parentDept, employees) => {
    const newDept = {
      id: String(Date.now()),
      name,
      code,
      head,
      parentDept: parentDept || '—',
      employees: parseInt(employees) || 1,
      status: 'Active'
    };
    setDepartments(prev => [...prev, newDept]);
    addNotification('settings', `Added new department: ${name}.`);
  };

  return (
    <ESGDataContext.Provider value={{
      // States
      departments, setDepartments,
      categories, setCategories,
      emissionFactors, setEmissionFactors,
      products, setProducts,
      environmentalGoals, setEnvironmentalGoals,
      policies, setPolicies,
      badges, setBadges,
      rewards, setRewards,
      carbonTransactions, setCarbonTransactions,
      csrActivities, setCsrActivities,
      employeeParticipations, setEmployeeParticipations,
      challenges, setChallenges,
      challengeParticipations, setChallengeParticipations,
      policyAcknowledgements, setPolicyAcknowledgements,
      audits, setAudits,
      complianceIssues, setComplianceIssues,
      activeUser, setActiveUser,
      usersList, setUsersList,
      settings, setSettings,
      notifications, setNotifications,

      // Calculations
      getDepartmentScores,
      getOverallESGScore,

      // Action Dispatchers
      logEmissionsTransaction,
      addEmissionFactor,
      addEnvironmentalGoal,
      updateGoalProgress,
      addCsrActivity,
      joinCsrActivity,
      approveParticipation,
      acknowledgePolicy,
      createComplianceIssue,
      resolveComplianceIssue,
      joinChallenge,
      submitChallengeProgress,
      approveChallengeParticipation,
      redeemReward,
      addDepartment,
      addNotification,
      awardUserXp,
      switchUser
    }}>
      {children}
    </ESGDataContext.Provider>
  );
};

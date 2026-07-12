import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { authService } from '../services/authService';
import { environmentalService } from '../services/environmentalService';
import { socialService } from '../services/socialService';
import { governanceService } from '../services/governanceService';
import { gamificationService } from '../services/gamificationService';
import { settingsService } from '../services/settingsService';
import { notificationsService } from '../services/notificationsService';

export const ESGDataContext = createContext();

export const ESGDataProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [emissionFactors, setEmissionFactors] = useState([]);
  const [products, setProducts] = useState([]);
  const [environmentalGoals, setEnvironmentalGoals] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [badges, setBadges] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [carbonTransactions, setCarbonTransactions] = useState([]);
  const [csrActivities, setCsrActivities] = useState([]);
  const [employeeParticipations, setEmployeeParticipations] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [challengeParticipations, setChallengeParticipations] = useState([]);
  const [policyAcknowledgements, setPolicyAcknowledgements] = useState([]);
  const [audits, setAudits] = useState([]);
  const [complianceIssues, setComplianceIssues] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    autoEmissionCalc: true,
    requireCSRevidence: true,
    autoAwardBadges: true,
    emailAlerts: true,
  });
  
  const [loading, setLoading] = useState(true);

  // Sync session state from Supabase
  useEffect(() => {
    async function checkUser() {
      try {
        const sessionData = await authService.getCurrentSession();
        if (sessionData) {
          setActiveUser(sessionData.profile);
          await loadAllOrgData(sessionData.profile.org_id, sessionData.profile);
        } else {
          setActiveUser(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Session check error:", err);
        setLoading(false);
      }
    }
    checkUser();

    // Set up auth state change listeners
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        try {
          const profile = await authService.getOrCreateUserProfile(session.user);
          setActiveUser(profile);
          await loadAllOrgData(profile.org_id, profile);
        } catch (err) {
          console.error("Profile load on auth change error:", err);
        }
      } else {
        setActiveUser(null);
        clearAllState();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearAllState = () => {
    setDepartments([]);
    setCategories([]);
    setEmissionFactors([]);
    setProducts([]);
    setEnvironmentalGoals([]);
    setPolicies([]);
    setBadges([]);
    setRewards([]);
    setCarbonTransactions([]);
    setCsrActivities([]);
    setEmployeeParticipations([]);
    setChallenges([]);
    setChallengeParticipations([]);
    setPolicyAcknowledgements([]);
    setAudits([]);
    setComplianceIssues([]);
    setUsersList([]);
  };

  const loadAllOrgData = async (orgId, profile) => {
    setLoading(true);
    try {
      // 1. Fetch departments. If empty, trigger seeder!
      const depts = await settingsService.fetchDepartments();
      
      if (depts.length === 0) {
        await seedNewOrganizationData(orgId, profile.id);
        // Reload after seed
        await reloadAllData(orgId);
        return;
      }

      setDepartments(depts);

      // 2. Fetch everything else in parallel
      const [
        factors,
        prodList,
        goals,
        pols,
        bdgs,
        rwds,
        txs,
        acts,
        parts,
        chals,
        chalParts,
        acks,
        auds,
        issues,
        config,
        members,
        notifs
      ] = await Promise.all([
        environmentalService.fetchEmissionFactors(),
        environmentalService.fetchProducts(),
        environmentalService.fetchEnvironmentalGoals(),
        governanceService.fetchPolicies(),
        gamificationService.fetchBadges(),
        gamificationService.fetchRewards(),
        environmentalService.fetchCarbonTransactions(),
        socialService.fetchCsrActivities(),
        socialService.fetchEmployeeParticipations(),
        gamificationService.fetchChallenges(),
        gamificationService.fetchChallengeParticipations(),
        governanceService.fetchPolicyAcknowledgements(),
        governanceService.fetchAudits(),
        governanceService.fetchComplianceIssues(),
        settingsService.fetchConfigSettings(orgId),
        authService.getOrgUsers(),
        notificationsService.fetchNotifications(orgId)
      ]);

      setEmissionFactors(factors);
      setProducts(prodList);
      setEnvironmentalGoals(goals);
      setPolicies(pols);
      setBadges(bdgs);
      setRewards(rwds);
      setCarbonTransactions(txs);
      setCsrActivities(acts);
      setEmployeeParticipations(parts);
      setChallenges(chals);
      setChallengeParticipations(chalParts);
      setPolicyAcknowledgements(acks);
      setAudits(auds);
      setComplianceIssues(issues);
      const mockProfiles = [
        { id: 'virtual-employee-1', org_id: orgId, name: 'Karan Shah', role: 'Employee', xp: 3910, points: 210, badges_unlocked: ['Green Beginner'], department: 'Manufacturing' },
        { id: 'virtual-manager-1', org_id: orgId, name: 'S. Nair', role: 'Manager', xp: 5200, points: 600, badges_unlocked: ['Sustainability Champion'], department: 'Logistics' }
      ];
      setUsersList([...members, ...mockProfiles]);
      setNotifications(notifs);

      setSettings({
        autoEmissionCalc: config.auto_emission_calc,
        requireCSRevidence: config.require_csr_evidence,
        autoAwardBadges: config.auto_award_badges,
        emailAlerts: config.email_alerts,
      });

    } catch (err) {
      console.error("Data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const reloadAllData = async (orgId) => {
    if (!orgId && activeUser) orgId = activeUser.org_id;
    if (!orgId) return;
    try {
      const [
        depts,
        factors,
        prodList,
        goals,
        pols,
        bdgs,
        rwds,
        txs,
        acts,
        parts,
        chals,
        chalParts,
        acks,
        auds,
        issues,
        members,
        notifs
      ] = await Promise.all([
        settingsService.fetchDepartments(),
        environmentalService.fetchEmissionFactors(),
        environmentalService.fetchProducts(),
        environmentalService.fetchEnvironmentalGoals(),
        governanceService.fetchPolicies(),
        gamificationService.fetchBadges(),
        gamificationService.fetchRewards(),
        environmentalService.fetchCarbonTransactions(),
        socialService.fetchCsrActivities(),
        socialService.fetchEmployeeParticipations(),
        gamificationService.fetchChallenges(),
        gamificationService.fetchChallengeParticipations(),
        governanceService.fetchPolicyAcknowledgements(),
        governanceService.fetchAudits(),
        governanceService.fetchComplianceIssues(),
        authService.getOrgUsers(),
        notificationsService.fetchNotifications(orgId)
      ]);

      setDepartments(depts);
      setEmissionFactors(factors);
      setProducts(prodList);
      setEnvironmentalGoals(goals);
      setPolicies(pols);
      setBadges(bdgs);
      setRewards(rwds);
      setCarbonTransactions(txs);
      setCsrActivities(acts);
      setEmployeeParticipations(parts);
      setChallenges(chals);
      setChallengeParticipations(chalParts);
      setPolicyAcknowledgements(acks);
      setAudits(auds);
      setComplianceIssues(issues);
      const mockProfiles = [
        { id: 'virtual-employee-1', org_id: orgId, name: 'Karan Shah', role: 'Employee', xp: 3910, points: 210, badges_unlocked: ['Green Beginner'], department: 'Manufacturing' },
        { id: 'virtual-manager-1', org_id: orgId, name: 'S. Nair', role: 'Manager', xp: 5200, points: 600, badges_unlocked: ['Sustainability Champion'], department: 'Logistics' }
      ];
      setUsersList([...members, ...mockProfiles]);
      setNotifications(notifs);
    } catch (err) {
      console.error("Reload error:", err);
    }
  };

  // Seeder to populate a new multi-tenant organization with rich demo data
  const seedNewOrganizationData = async (orgId, profileId) => {
    try {
      // 1. Departments
      const { data: dept1 } = await supabase.from('departments').insert({ org_id: orgId, name: 'Manufacturing', code: 'MFC', head: 'S. Nair', employees: 134 }).select().single();
      const { data: dept2 } = await supabase.from('departments').insert({ org_id: orgId, name: 'Logistics', code: 'LOC', head: 'R. Iyer', employees: 58, parent_dept_id: dept1.id }).select().single();
      await supabase.from('departments').insert([
        { org_id: orgId, name: 'Corporate', code: 'COF', head: 'A. Mehta', employees: 41 },
        { org_id: orgId, name: 'Sales', code: 'SAL', head: 'M. Sharma', employees: 85 },
      ]);

      // 2. Emission Factors
      const { data: f1 } = await supabase.from('emission_factors').insert({ org_id: orgId, name: 'Grid Electricity', category: 'Electricity', co2_per_unit: 0.85, unit: 'kWh' }).select().single();
      const { data: f2 } = await supabase.from('emission_factors').insert({ org_id: orgId, name: 'Diesel fuel (Fleet)', category: 'Fleet Fuel', co2_per_unit: 2.68, unit: 'Liters' }).select().single();
      await supabase.from('emission_factors').insert([
        { org_id: orgId, name: 'Natural Gas', category: 'Heating', co2_per_unit: 1.89, unit: 'm³' },
        { org_id: orgId, name: 'Air Travel (Short Haul)', category: 'Business Travel', co2_per_unit: 0.15, unit: 'km' }
      ]);

      // 3. Products
      await supabase.from('products').insert([
        { org_id: orgId, name: 'EcoPack Cardboard Box', carbon_footprint: 0.12, recyclability: 100, material_source: 'Recycled Pulp' },
        { org_id: orgId, name: 'Standard Plastic Shrink', carbon_footprint: 0.89, recyclability: 30, material_source: 'Petroleum Base' },
      ]);

      // 4. Goals
      await supabase.from('environmental_goals').insert([
        { org_id: orgId, name: 'Reduce Fleet Emissions', department_id: dept2.id, target_co2: 500, current_co2: 350, deadline: '2026-12-31', status: 'Active' },
        { org_id: orgId, name: 'Cut Packaging Waste', department_id: dept1.id, target_co2: 120, current_co2: 98, deadline: '2026-09-30', status: 'On Track' },
      ]);

      // 5. Policies
      const { data: pol1 } = await supabase.from('policies').insert({ org_id: orgId, title: 'Anti-Corruption Policy', category: 'Ethics & Compliance', content: 'Our code of conduct requires strict compliance with global anti-bribery standards. No employee may offer, request, or receive bribes of any nature.', version: 'v2.1', effective_date: '2026-01-01' }).select().single();
      await supabase.from('policies').insert([
        { org_id: orgId, title: 'Supplier Code of Conduct', category: 'Supply Chain', content: 'All suppliers must guarantee fair wages, safe working environments, and document zero usage of forced labor.', version: 'v1.4', effective_date: '2026-03-15' },
      ]);

      // 6. Badges
      await supabase.from('badges').insert([
        { org_id: orgId, name: 'Green Beginner', description: 'Awarded for completing your first sustainability challenge.', unlock_rule: 'Complete 1 Challenge', icon: '🌱' },
        { org_id: orgId, name: 'Team Player', description: 'Awarded for participating in 3 or more CSR activities.', unlock_rule: 'Participate in 3 CSR Activities', icon: '🤝' },
        { org_id: orgId, name: 'Sustainability Champion', description: 'Awarded for earning more than 5,000 total XP.', unlock_rule: 'Reach 5000 XP', icon: '🏆' },
      ]);

      // 7. Rewards
      await supabase.from('rewards').insert([
        { org_id: orgId, name: 'Eco Coffee Mug', description: 'Double-walled stainless steel reusable coffee mug with EcoSphere branding.', points_required: 50, stock: 8 },
        { org_id: orgId, name: 'Tree Planting Certificate', description: 'We will plant a native tree in your name in the local forest reserve.', points_required: 100, stock: 999 },
      ]);

      // 8. CSR Activities
      await supabase.from('csr_activities').insert([
        { org_id: orgId, name: 'Tree Plantation Drive', description: 'Join the annual afforestation campaign in the northern suburbs to restore forest canopy.', points: 50, evidence_required: true },
        { org_id: orgId, name: 'ESG Corporate Workshop', description: 'Participate in the compliance training and sustainable operational standards seminar.', points: 20, evidence_required: false },
      ]);

      // 9. Challenges
      await supabase.from('challenges').insert([
        { org_id: orgId, title: 'Sustainability Sprint', category: 'Carbon reduction', description: 'Cut your monthly operational carbon footprint by 10% through conscious energy consumption.', xp: 200, difficulty: 'Hard', deadline: '2026-07-20' },
        { org_id: orgId, title: 'Recycle Challenge', category: 'Waste sorting', description: 'Properly categorize office waste.', xp: 80, difficulty: 'Easy', deadline: '2026-07-15' },
      ]);

      // 10. Initial Carbon logs
      await supabase.from('carbon_transactions').insert([
        { org_id: orgId, date: '2026-07-01', type: 'Fleet', quantity: 150, unit: 'Liters', emission_factor_name: 'Diesel fuel (Fleet)', co2_value: 402.0, department_id: dept2.id },
        { org_id: orgId, date: '2026-07-03', type: 'Purchase', quantity: 2400, unit: 'kWh', emission_factor_name: 'Grid Electricity', co2_value: 2040.0, department_id: dept1.id },
      ]);

    } catch (err) {
      console.error("Seeding error:", err);
    }
  };

  // Switch virtual profiles for local demo
  const switchUser = async (userId) => {
    try {
      let selectedProfile = usersList.find(u => u.id === userId);
      if (!selectedProfile) {
        const mockProfiles = [
          { id: 'virtual-employee-1', org_id: activeUser?.org_id, name: 'Karan Shah', role: 'Employee', xp: 3910, points: 210, badges_unlocked: ['Green Beginner'], department: 'Manufacturing' },
          { id: 'virtual-manager-1', org_id: activeUser?.org_id, name: 'S. Nair', role: 'Manager', xp: 5200, points: 600, badges_unlocked: ['Sustainability Champion'], department: 'Logistics' }
        ];
        selectedProfile = mockProfiles.find(u => u.id === userId);
      }
      if (selectedProfile) {
        setActiveUser(selectedProfile);
        await addNotification('info', `Switched active profile to ${selectedProfile.name} (${selectedProfile.role}).`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addNotification = async (type, message) => {
    if (!activeUser) return;
    try {
      const newNotif = await notificationsService.addNotification(activeUser.org_id, type, message);
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      console.error("Failed to save notification:", err);
      const localNotif = {
        id: Date.now(),
        type,
        message,
        date: new Date().toLocaleDateString(),
      };
      setNotifications(prev => [localNotif, ...prev]);
    }
  };

  const awardEmployeeXp = async (employeeId, amount) => {
    try {
      const emp = usersList.find(u => u.id === employeeId);
      if (!emp) return;

      const nextXp = emp.xp + amount;
      const nextPoints = emp.points + amount;
      const earnedBadges = [...(emp.badges_unlocked || [])];

      if (settings.autoAwardBadges) {
        if (nextXp >= 5000 && !earnedBadges.includes('Sustainability Champion')) {
          earnedBadges.push('Sustainability Champion');
          await addNotification('badge', `Congratulations! ${emp.name} unlocked the "Sustainability Champion" Badge! 🏆`);
        }
      }

      const updatedProfile = await authService.updateProfile(employeeId, {
        xp: nextXp,
        points: nextPoints,
        badges_unlocked: earnedBadges
      });

      setUsersList(prev => prev.map(u => u.id === employeeId ? updatedProfile : u));
      if (activeUser && activeUser.id === employeeId) {
        setActiveUser(updatedProfile);
      }
    } catch (err) {
      console.error("XP Award failed:", err);
    }
  };

  const awardUserXp = async (amount) => {
    if (!activeUser) return;
    await awardEmployeeXp(activeUser.id, amount);
  };

  const unlockEmployeeBadge = async (employeeId, badgeName, badgeIcon) => {
    try {
      const emp = usersList.find(u => u.id === employeeId);
      if (!emp) return;

      const earnedBadges = [...(emp.badges_unlocked || [])];
      if (earnedBadges.includes(badgeName)) return;

      earnedBadges.push(badgeName);
      await addNotification('badge', `Congratulations! ${emp.name} unlocked the "${badgeName}" Badge! ${badgeIcon}`);

      const updatedProfile = await authService.updateProfile(employeeId, {
        badges_unlocked: earnedBadges
      });

      setUsersList(prev => prev.map(u => u.id === employeeId ? updatedProfile : u));
      if (activeUser && activeUser.id === employeeId) {
        setActiveUser(updatedProfile);
      }
    } catch (err) {
      console.error("Badge unlock failed:", err);
    }
  };

  // Dynamic score calculator
  const getDepartmentScores = (deptName) => {
    const dept = departments.find(d => d.name === deptName);
    if (!dept) return { environmental: 80, social: 70, governance: 80, total: 77 };

    const deptEmissions = carbonTransactions
      .filter(t => t.department_id === dept.id && t.status === 'Active')
      .reduce((sum, t) => sum + parseFloat(t.co2_value), 0);

    const deptGoals = environmentalGoals.filter(g => g.department_id === dept.id);
    let goalCompletionSum = 0;
    deptGoals.forEach(g => {
      const prog = g.target_co2 > 0 ? (g.current_co2 / g.target_co2) * 100 : 0;
      if (g.status === 'Completed') goalCompletionSum += 100;
      else if (g.status === 'On Track') goalCompletionSum += 80;
      else goalCompletionSum += Math.min(prog, 100);
    });
    const avgGoalProgress = deptGoals.length > 0 ? goalCompletionSum / deptGoals.length : 90;

    const emissionDeduction = Math.min((deptEmissions / 100), 40);
    const calculatedEnvScore = Math.max(Math.round(avgGoalProgress * 0.7 + (100 - emissionDeduction) * 0.3), 0);

    // Social Score
    const approvedCSRsCount = employeeParticipations.filter(p => p.employee_id === activeUser?.id && p.status === 'Approved').length;
    const completedChallengesCount = challengeParticipations.filter(p => p.employee_id === activeUser?.id && p.status === 'Approved').length;

    const participationRate = Math.min(((approvedCSRsCount + completedChallengesCount) / (dept.employees || 10)) * 100, 100);
    const calculatedSocScore = Math.min(Math.round(50 + participationRate * 0.5), 100);

    // Governance Score
    const deptOpenIssues = complianceIssues.filter(i => i.department_id === dept.id && i.status === 'Open').length;
    const auditStatusCount = audits.filter(a => a.department_id === dept.id && a.status === 'Completed').length;
    const calculatedGovScore = Math.max(Math.min(100 - (deptOpenIssues * 15) + (auditStatusCount * 5), 100), 0);

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

  const getOverallESGScore = () => {
    if (departments.length === 0) return { environmental: 80, social: 70, governance: 80, total: 77 };
    let envSum = 0, socSum = 0, govSum = 0, totalSum = 0;
    
    departments.forEach(d => {
      const scores = getDepartmentScores(d.name);
      envSum += scores.environmental;
      socSum += scores.social;
      govSum += scores.governance;
      totalSum += scores.total;
    });

    const count = departments.length || 1;
    return {
      environmental: Math.round(envSum / count),
      social: Math.round(socSum / count),
      governance: Math.round(govSum / count),
      total: Math.round(totalSum / count),
    };
  };

  // --- COMPONENT HANDLERS LINKED TO SERVICES ---

  const logEmissionsTransaction = async (type, quantity, factorId, customDate, deptName, customCo2) => {
    if (!activeUser) return;
    const factor = emissionFactors.find(f => f.id === factorId);
    const dept = departments.find(d => d.name === deptName);
    if (!factor || !dept) return;

    let co2;
    if (settings.autoEmissionCalc) {
      co2 = parseFloat((quantity * factor.co2_per_unit).toFixed(2));
    } else {
      co2 = parseFloat(customCo2) || 0;
    }
    
    try {
      const newTransaction = await environmentalService.logEmissionsTransaction(
        activeUser.org_id,
        type,
        quantity,
        factor.unit,
        factor.name,
        co2,
        dept.id,
        customDate
      );

      setCarbonTransactions(prev => [newTransaction, ...prev]);
      await addNotification('environmental', `New ${type} emissions log registered: ${co2} kg CO2e.`);
      await awardUserXp(10);
    } catch (err) {
      alert(`Emissions Log Failed: ${err.message || err}`);
    }
  };

  const addEmissionFactor = async (name, category, co2PerUnit, unit) => {
    if (!activeUser) return;
    try {
      const newFactor = await environmentalService.addEmissionFactor(
        activeUser.org_id,
        name,
        category,
        co2PerUnit,
        unit
      );
      setEmissionFactors(prev => [...prev, newFactor]);
      addNotification('settings', `Added new emission factor: ${name}.`);
    } catch (err) {
      alert(`Add Factor Failed: ${err.message || err}`);
    }
  };

  const addEnvironmentalGoal = async (name, deptName, targetCo2, deadline) => {
    if (!activeUser) return;
    const dept = departments.find(d => d.name === deptName);
    if (!dept) return;

    try {
      const newGoal = await environmentalService.addEnvironmentalGoal(
        activeUser.org_id,
        name,
        dept.id,
        targetCo2,
        deadline
      );
      // Map dept name back
      const formatted = { ...newGoal, department: deptName };
      setEnvironmentalGoals(prev => [...prev, formatted]);
      addNotification('environmental', `New environmental target set: "${name}".`);
    } catch (err) {
      alert(`Add Goal Failed: ${err.message || err}`);
    }
  };

  const updateGoalProgress = async (goalId, currentCo2) => {
    const goal = environmentalGoals.find(g => g.id === goalId);
    if (!goal) return;

    const parsedCo2 = parseFloat(currentCo2);
    const isCompleted = parsedCo2 >= goal.target_co2;
    const status = isCompleted ? 'Completed' : (parsedCo2 > goal.target_co2 * 0.75 ? 'On Track' : 'Active');

    try {
      const updated = await environmentalService.updateGoalProgress(goalId, currentCo2, status);
      setEnvironmentalGoals(prev => prev.map(g => g.id === goalId ? { ...g, current_co2: parsedCo2, status } : g));
      addNotification('environmental', `Updated progress for target: "${goal.name}".`);
    } catch (err) {
      alert(`Update Progress Failed: ${err.message || err}`);
    }
  };

  const addCsrActivity = async (name, description, points, evidenceRequired) => {
    if (!activeUser) return;
    try {
      const newAct = await socialService.addCsrActivity(
        activeUser.org_id,
        name,
        description,
        points,
        evidenceRequired
      );
      setCsrActivities(prev => [...prev, newAct]);
      addNotification('social', `New CSR Initiative added: "${name}".`);
    } catch (err) {
      alert(`Add Activity Failed: ${err.message || err}`);
    }
  };

  const joinCsrActivity = async (activityId, employeeName, proofFile) => {
    if (!activeUser) return;
    const activity = csrActivities.find(a => a.id === activityId);
    if (!activity) return;

    let proofUrl = 'none';
    try {
      if (proofFile && typeof proofFile !== 'string') {
        proofUrl = await socialService.uploadEvidenceFile(proofFile);
      } else if (proofFile) {
        proofUrl = proofFile; // fallback if text
      }

      if (activeUser.id.startsWith('virtual-')) {
        const mockPart = {
          id: Date.now(),
          org_id: activeUser.org_id,
          employee_id: activeUser.id,
          employee: activeUser.name,
          activity_id: activityId,
          activityName: activity.name,
          proof_url: proofUrl,
          points_earned: activity.points,
          status: 'Joined',
          date: new Date().toISOString().split('T')[0]
        };
        setEmployeeParticipations(prev => [mockPart, ...prev]);
        await addNotification('social', `Submitted participation request for "${activity.name}".`);
        return;
      }

      const newParticipation = await socialService.joinCsrActivity(
        activeUser.org_id,
        activeUser.id,
        activityId,
        proofUrl,
        activity.points
      );

      // Reload participations to get profiles join
      const updatedParts = await socialService.fetchEmployeeParticipations();
      setEmployeeParticipations(updatedParts);
      await addNotification('social', `Submitted participation request for "${activity.name}".`);
    } catch (err) {
      alert(`Join CSR Failed: ${err.message || err}`);
    }
  };

  const approveParticipation = async (participationId, approved) => {
    if (!activeUser || activeUser.role !== 'Manager') return;
    const part = employeeParticipations.find(p => p.id === participationId);
    if (!part) return;

    const status = approved ? 'Approved' : 'Rejected';
    try {
      if (typeof participationId === 'number' || String(participationId).startsWith('virtual-')) {
        setEmployeeParticipations(prev => prev.map(p => p.id === participationId ? { ...p, status } : p));
        const emp = usersList.find(u => u.id === part.employee_id);
        const empName = emp ? emp.name : (part.employee || 'Employee');

        if (approved) {
          await awardEmployeeXp(part.employee_id, part.points_earned);
          if (settings.autoAwardBadges) {
            const approvedCount = employeeParticipations.filter(p => p.employee_id === part.employee_id && p.status === 'Approved').length + 1;
            if (approvedCount >= 3) {
              await unlockEmployeeBadge(part.employee_id, 'Team Player', '🤝');
            }
          }
          await addNotification('social', `Volunteer credit approved for ${empName}.`);
        } else {
          await addNotification('social', `Volunteer credit rejected for ${empName}.`);
        }
        return;
      }

      await socialService.updateParticipationStatus(participationId, status);
      
      // Update local state
      setEmployeeParticipations(prev => prev.map(p => p.id === participationId ? { ...p, status } : p));
      
      const emp = usersList.find(u => u.id === part.employee_id);
      const empName = emp ? emp.name : (part.employee || 'Employee');

      if (approved) {
        await awardEmployeeXp(part.employee_id, part.points_earned);
        
        // Auto Badge Rule Check for CSR activity count (Team Player)
        if (settings.autoAwardBadges) {
          const approvedCount = employeeParticipations.filter(p => p.employee_id === part.employee_id && p.status === 'Approved').length + 1;
          if (approvedCount >= 3) {
            await unlockEmployeeBadge(part.employee_id, 'Team Player', '🤝');
          }
        }
        await addNotification('social', `Volunteer credit approved for ${empName}.`);
      } else {
        await addNotification('social', `Volunteer credit rejected for ${empName}.`);
      }
    } catch (err) {
      alert(`Status Update Failed: ${err.message || err}`);
    }
  };

  const acknowledgePolicy = async (policyTitle) => {
    if (!activeUser) return;
    const policy = policies.find(p => p.title === policyTitle);
    if (!policy) return;

    try {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      
      const { data, error } = await supabase
        .from('policy_acknowledgements')
        .insert({
          org_id: activeUser.org_id,
          policy_id: policy.id,
          employee_id: activeUser.id,
          date: now.toISOString().split('T')[0],
          created_at: now.toISOString()
        })
        .select()
        .single();
      if (error) throw error;

      const formattedAcks = await governanceService.fetchPolicyAcknowledgements();
      setPolicyAcknowledgements(formattedAcks);
      await addNotification('governance', `Policy Acknowledged: "${policyTitle}" signed by ${activeUser.name}.`);
      await awardUserXp(15);
    } catch (err) {
      alert(`Policy Sign-off Failed: ${err.message || err}`);
    }
  };

  const createComplianceIssue = async (auditTitle, issue, severity, deptName, ownerName, dueDate) => {
    if (!activeUser) return;
    const audit = audits.find(a => a.title === auditTitle);
    const dept = departments.find(d => d.name === deptName);
    const owner = usersList.find(u => u.name === ownerName);
    if (!audit || !dept || !owner) return;

    try {
      const newIssue = await governanceService.createComplianceIssue(
        activeUser.org_id,
        audit.id,
        issue,
        severity,
        dept.id,
        owner.id,
        dueDate
      );

      const formattedIssues = await governanceService.fetchComplianceIssues();
      setComplianceIssues(formattedIssues);
      await addNotification('governance', `⚠️ Compliance Ticket Raised: "${issue}".`);
      if (settings.emailAlerts) {
        await addNotification('governance', `✉️ Email Alert dispatched to ${owner.name} regarding compliance issue: "${issue}"`);
      }
    } catch (err) {
      alert(`Raise Issue Failed: ${err.message || err}`);
    }
  };

  const resolveComplianceIssue = async (issueId) => {
    try {
      await governanceService.resolveComplianceIssue(issueId);
      setComplianceIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: 'Resolved' } : i));
      addNotification('governance', `Compliance issue resolved.`);
    } catch (err) {
      alert(`Resolve Issue Failed: ${err.message || err}`);
    }
  };

  const joinChallenge = async (challengeId) => {
    if (!activeUser) return;
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    try {
      if (activeUser.id.startsWith('virtual-')) {
        const mockPart = {
          id: Date.now(),
          org_id: activeUser.org_id,
          challenge_id: challengeId,
          challengeTitle: challenge.title,
          employee_id: activeUser.id,
          employee: activeUser.name,
          progress: 0,
          proof_url: 'none',
          status: 'Joined',
          xp_awarded: 0,
          date: new Date().toISOString().split('T')[0]
        };
        setChallengeParticipations(prev => [mockPart, ...prev]);
        await addNotification('gamification', `Joined Challenge: "${challenge.title}"`);
        return;
      }

      await gamificationService.joinChallenge(
        activeUser.org_id,
        challengeId,
        activeUser.id
      );

      const updatedParts = await gamificationService.fetchChallengeParticipations();
      setChallengeParticipations(updatedParts);
      await addNotification('gamification', `Joined Challenge: "${challenge.title}"`);
    } catch (err) {
      alert(`Enroll Challenge Failed: ${err.message || err}`);
    }
  };

  const submitChallengeProgress = async (participationId, progressVal, proofFile) => {
    if (!activeUser) return;
    try {
      let proofUrl = 'none';
      if (proofFile && typeof proofFile !== 'string') {
        proofUrl = await socialService.uploadEvidenceFile(proofFile);
      }

      if (typeof participationId === 'number' || String(participationId).startsWith('virtual-')) {
        const isComplete = parseInt(progressVal) >= 100;
        const status = isComplete ? 'Under Review' : 'Joined';
        setChallengeParticipations(prev => prev.map(p => p.id === participationId ? { ...p, progress: parseInt(progressVal), proof_url: proofUrl, status } : p));
        await addNotification('gamification', `Submitted progress parameters update.`);
        return;
      }

      await gamificationService.submitChallengeProgress(participationId, progressVal, proofUrl);
      const updatedParts = await gamificationService.fetchChallengeParticipations();
      setChallengeParticipations(updatedParts);
      await addNotification('gamification', `Submitted progress parameters update.`);
    } catch (err) {
      alert(`Progress Log Failed: ${err.message || err}`);
    }
  };

  const approveChallengeParticipation = async (participationId, approved) => {
    if (!activeUser || activeUser.role !== 'Manager') return;
    const part = challengeParticipations.find(p => p.id === participationId);
    if (!part) return;

    const chal = challenges.find(c => c.title === part.challengeTitle);
    if (!chal) return;

    const status = approved ? 'Approved' : 'Rejected';
    const xp = approved ? chal.xp : 0;
    try {
      if (typeof participationId === 'number' || String(participationId).startsWith('virtual-')) {
        setChallengeParticipations(prev => prev.map(p => p.id === participationId ? { ...p, status, xp_awarded: xp } : p));
        const emp = usersList.find(u => u.id === part.employee_id);
        const empName = emp ? emp.name : (part.employee || 'Employee');

        if (approved) {
          await awardEmployeeXp(part.employee_id, chal.xp);
          if (settings.autoAwardBadges) {
            const completedCount = challengeParticipations.filter(p => p.employee_id === part.employee_id && p.status === 'Approved').length + 1;
            if (completedCount >= 1) {
              await unlockEmployeeBadge(part.employee_id, 'Green Beginner', '🌱');
            }
          }
          await addNotification('gamification', `Challenge approved for ${empName} (+${chal.xp} XP).`);
        } else {
          await addNotification('gamification', `Challenge submission rejected for ${empName}.`);
        }
        return;
      }

      await gamificationService.updateChallengeParticipationStatus(participationId, status, xp);
      setChallengeParticipations(prev => prev.map(p => p.id === participationId ? { ...p, status, xp_awarded: xp } : p));
      
      const emp = usersList.find(u => u.id === part.employee_id);
      const empName = emp ? emp.name : (part.employee || 'Employee');

      if (approved) {
        await awardEmployeeXp(part.employee_id, chal.xp);
        
        // Badge unlock check (Green Beginner badge)
        if (settings.autoAwardBadges) {
          const completedCount = challengeParticipations.filter(p => p.employee_id === part.employee_id && p.status === 'Approved').length + 1;
          if (completedCount >= 1) {
            await unlockEmployeeBadge(part.employee_id, 'Green Beginner', '🌱');
          }
        }
        await addNotification('gamification', `Challenge approved for ${empName} (+${chal.xp} XP).`);
      } else {
        await addNotification('gamification', `Challenge submission rejected for ${empName}.`);
      }
    } catch (err) {
      alert(`Approve Challenge Failed: ${err.message || err}`);
    }
  };

  const updateChallengeStatus = async (challengeId, status) => {
    try {
      const updated = await gamificationService.updateChallengeStatus(challengeId, status);
      setChallenges(prev => prev.map(c => c.id === challengeId ? updated : c));
      await addNotification('gamification', `Challenge status updated to ${status}: "${updated.title}".`);
    } catch (err) {
      alert(`Update Challenge Status Failed: ${err.message || err}`);
    }
  };

  const addChallenge = async (title, category, description, xp, difficulty, deadline) => {
    if (!activeUser) return;
    try {
      const newChal = await gamificationService.addChallenge(
        activeUser.org_id,
        title,
        category,
        description,
        xp,
        difficulty,
        deadline
      );
      setChallenges(prev => [...prev, newChal]);
      await addNotification('gamification', `Created Challenge: "${title}" (Status: Draft).`);
    } catch (err) {
      alert(`Add Challenge Failed: ${err.message || err}`);
    }
  };

  const redeemReward = async (rewardId) => {
    if (!activeUser) return;
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    try {
      const updatedProfile = await gamificationService.redeemReward(
        activeUser.org_id,
        rewardId,
        reward.stock,
        reward.points_required,
        activeUser.id,
        activeUser.points
      );

      // Update local state
      setActiveUser(updatedProfile);
      setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, stock: r.stock - 1 } : r));
      addNotification('reward', `Redeemed: "${reward.name}" (-${reward.points_required} Pts).`);
      alert(`Success! Redeemed "${reward.name}".`);
    } catch (err) {
      alert(`Redeem Failed: ${err.message || err}`);
    }
  };

  const addDepartment = async (name, code, head, parentDept, employees) => {
    if (!activeUser) return;
    try {
      const newDept = await settingsService.addDepartment(
        activeUser.org_id,
        name,
        code,
        head,
        parentDept,
        employees
      );
      setDepartments(prev => [...prev, newDept]);
      addNotification('settings', `Created Department: ${name}.`);
    } catch (err) {
      alert(`Add Department Failed: ${err.message || err}`);
    }
  };

  const handleUpdateSettings = async (key) => {
    if (!activeUser) return;
    const dbKey = key === 'autoEmissionCalc' ? 'auto_emission_calc' :
                  key === 'requireCSRevidence' ? 'require_csr_evidence' :
                  key === 'autoAwardBadges' ? 'auto_award_badges' : 'email_alerts';
                  
    const nextVal = !settings[key];
    try {
      await settingsService.updateConfigSettings(activeUser.org_id, {
        [dbKey]: nextVal
      });
      setSettings(prev => ({ ...prev, [key]: nextVal }));
      addNotification('settings', `System settings config updated.`);
    } catch (err) {
      alert(`Settings Update Failed: ${err.message || err}`);
    }
  };

  return (
    <ESGDataContext.Provider value={{
      loading,
      departments,
      categories,
      emissionFactors,
      products,
      environmentalGoals,
      policies,
      badges,
      rewards,
      carbonTransactions,
      csrActivities,
      employeeParticipations,
      challenges,
      challengeParticipations,
      policyAcknowledgements,
      audits,
      complianceIssues,
      activeUser,
      usersList,
      settings,
      notifications,

      getDepartmentScores,
      getOverallESGScore,

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
      switchUser,
      handleUpdateSettings,
      updateChallengeStatus,
      addChallenge
    }}>
      {children}
    </ESGDataContext.Provider>
  );
};

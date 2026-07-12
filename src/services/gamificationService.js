import { supabase } from './supabaseClient';

export const gamificationService = {
  async fetchChallenges() {
    const { data, error } = await supabase.from('challenges').select('*');
    if (error) throw error;
    return data;
  },

  async fetchChallengeParticipations() {
    const { data, error } = await supabase
      .from('challenge_participations')
      .select('*, profiles(name)');
    if (error) throw error;
    
    return data.map(p => ({
      ...p,
      employee: p.profiles?.name || 'Unknown'
    }));
  },

  async fetchBadges() {
    const { data, error } = await supabase.from('badges').select('*');
    if (error) throw error;
    return data;
  },

  async fetchRewards() {
    const { data, error } = await supabase.from('rewards').select('*');
    if (error) throw error;
    return data;
  },

  async joinChallenge(orgId, challengeId, employeeId) {
    const { data, error } = await supabase
      .from('challenge_participations')
      .insert({
        org_id: orgId,
        challenge_id: challengeId,
        employee_id: employeeId,
        progress: 0,
        proof_url: 'none',
        status: 'Joined',
        xp_awarded: 0,
        date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async submitChallengeProgress(participationId, progress, proofUrl) {
    const isComplete = parseInt(progress) >= 100;
    const { data, error } = await supabase
      .from('challenge_participations')
      .update({
        progress: parseInt(progress),
        proof_url: proofUrl || 'Details logged',
        status: isComplete ? 'Under Review' : 'Joined'
      })
      .eq('id', participationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateChallengeParticipationStatus(participationId, status, xpAwarded) {
    const { data, error } = await supabase
      .from('challenge_participations')
      .update({
        status,
        xp_awarded: xpAwarded
      })
      .eq('id', participationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async redeemReward(orgId, rewardId, currentStock, pointsRequired, employeeId, currentPoints) {
    if (currentStock <= 0) throw new Error("Reward item is out of stock.");
    if (currentPoints < pointsRequired) throw new Error("Insufficient points balance.");

    // 1. Decrement Stock
    const { error: rewardErr } = await supabase
      .from('rewards')
      .update({ stock: currentStock - 1 })
      .eq('id', rewardId);

    if (rewardErr) throw rewardErr;

    // 2. Deduct Points from Employee Profile
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .update({ points: currentPoints - pointsRequired })
      .eq('id', employeeId)
      .select()
      .single();

    if (profileErr) throw profileErr;

    return profile;
  },

  async addChallenge(orgId, title, category, description, xp, difficulty, deadline) {
    const { data, error } = await supabase
      .from('challenges')
      .insert({
        org_id: orgId,
        title,
        category,
        description,
        xp: parseInt(xp),
        difficulty,
        evidence_required: true,
        deadline,
        status: 'Active'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

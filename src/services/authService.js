import { supabase } from './supabaseClient';

export const authService = {
  // Sign up creates an organization first, then signs up the auth user, and registers their profile
  async signUp(email, password, name, orgName) {
    // 1. Create Organization
    const { data: org, error: orgErr } = await supabase
      .from('organizations')
      .insert({ name: orgName })
      .select()
      .single();

    if (orgErr) throw orgErr;

    // 2. Sign Up auth user
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authErr) throw authErr;
    if (!authData.user) throw new Error("Authentication user object is missing.");

    // 3. Register user profile linked to org and set as Manager by default
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        org_id: org.id,
        name,
        role: 'Manager', // First user in the org gets Manager rights
        xp: 0,
        points: 0,
        badges_unlocked: []
      })
      .select()
      .single();

    if (profileErr) throw profileErr;

    return { user: authData.user, profile };
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Fetch profile
    const profile = await this.getUserProfile(data.user.id);
    return { user: data.user, profile };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  },

  async getOrCreateUserProfile(user) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!error && data) return data;
    } catch (err) {
      console.warn("Profile fetch failed, attempting creation...", err);
    }

    let orgId;
    try {
      const { data: orgs, error: orgsErr } = await supabase
        .from('organizations')
        .select('id')
        .limit(1);

      if (orgs && orgs.length > 0) {
        orgId = orgs[0].id;
      } else {
        const { data: newOrg, error: newOrgErr } = await supabase
          .from('organizations')
          .insert({ name: 'EcoSphere Global' })
          .select()
          .single();
        if (newOrgErr) throw newOrgErr;
        orgId = newOrg.id;
      }
    } catch (orgErr) {
      console.error("Organization check failed:", orgErr);
      throw orgErr;
    }

    const name = user.user_metadata?.full_name || user.email.split('@')[0];
    const { data: newProfile, error: profileErr } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        org_id: orgId,
        name,
        role: 'Manager',
        xp: 0,
        points: 0,
        badges_unlocked: []
      })
      .select()
      .single();

    if (profileErr) throw profileErr;
    return newProfile;
  },

  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session) return null;

    const profile = await this.getOrCreateUserProfile(session.user);
    return { session, profile };
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getOrgUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
      
    if (error) throw error;
    return data;
  }
};

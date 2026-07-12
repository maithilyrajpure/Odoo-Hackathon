import { supabase } from './supabaseClient';

export const settingsService = {
  async fetchDepartments() {
    const { data, error } = await supabase.from('departments').select('*');
    if (error) throw error;
    return data;
  },

  async addDepartment(orgId, name, code, head, parentDeptName, employees) {
    // Parent department matches:
    let parentId = null;
    if (parentDeptName && parentDeptName !== '—') {
      const { data: parentMatch } = await supabase
        .from('departments')
        .select('id')
        .eq('name', parentDeptName)
        .eq('org_id', orgId)
        .maybeSingle();
      if (parentMatch) parentId = parentMatch.id;
    }

    const { data, error } = await supabase
      .from('departments')
      .insert({
        org_id: orgId,
        name,
        code,
        head,
        parent_dept_id: parentId,
        employees: parseInt(employees) || 1,
        status: 'Active'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async fetchConfigSettings(orgId) {
    const { data, error } = await supabase
      .from('config_settings')
      .select('*')
      .eq('org_id', orgId)
      .maybeSingle();

    if (error) throw error;
    
    // Seed default if it doesn't exist yet
    if (!data) {
      const { data: seeded, error: seedErr } = await supabase
        .from('config_settings')
        .insert({
          org_id: orgId,
          auto_emission_calc: true,
          require_csr_evidence: true,
          auto_award_badges: true,
          email_alerts: true
        })
        .select()
        .single();
      if (seedErr) throw seedErr;
      return seeded;
    }

    return data;
  },

  async updateConfigSettings(orgId, updates) {
    const { data, error } = await supabase
      .from('config_settings')
      .update(updates)
      .eq('org_id', orgId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

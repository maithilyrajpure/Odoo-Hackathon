import { supabase } from './supabaseClient';

export const socialService = {
  async fetchCsrActivities() {
    const { data, error } = await supabase.from('csr_activities').select('*');
    if (error) throw error;
    return data;
  },

  async fetchEmployeeParticipations() {
    const { data, error } = await supabase
      .from('employee_participations')
      .select('*, profiles(name, department)'); // joins profile data
    if (error) throw error;
    
    // Map profiles joint fields for compatibility with existing UI
    return data.map(p => ({
      ...p,
      employee: p.profiles?.name || 'Unknown',
      department: p.profiles?.department || 'Unknown'
    }));
  },

  async uploadEvidenceFile(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `evidence/${fileName}`;

    const { data, error } = await supabase.storage
      .from('csr-evidence')
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('csr-evidence')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async addCsrActivity(orgId, name, description, points, evidenceRequired) {
    const { data, error } = await supabase
      .from('csr_activities')
      .insert({
        org_id: orgId,
        name,
        description,
        points: parseInt(points),
        status: 'Active',
        evidence_required: !!evidenceRequired
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async joinCsrActivity(orgId, employeeId, activityId, proofUrl, points) {
    const { data, error } = await supabase
      .from('employee_participations')
      .insert({
        org_id: orgId,
        employee_id: employeeId,
        activity_id: activityId,
        proof_url: proofUrl,
        points_earned: points,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateParticipationStatus(participationId, status) {
    const { data, error } = await supabase
      .from('employee_participations')
      .update({ status })
      .eq('id', participationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

import { supabase } from './supabaseClient';

export const governanceService = {
  async fetchPolicies() {
    const { data, error } = await supabase.from('policies').select('*');
    if (error) throw error;
    return data;
  },

  async fetchPolicyAcknowledgements() {
    const { data, error } = await supabase
      .from('policy_acknowledgements')
      .select('*, profiles(name)');
    if (error) throw error;
    
    return data.map(ack => ({
      ...ack,
      employee: ack.profiles?.name || 'Unknown'
    }));
  },

  async fetchAudits() {
    const { data, error } = await supabase
      .from('audits')
      .select('*, departments(name), profiles(name)');
    if (error) throw error;
    
    return data.map(a => ({
      ...a,
      department: a.departments?.name || 'Unknown',
      auditor: a.profiles?.name || 'Unknown'
    }));
  },

  async fetchComplianceIssues() {
    const { data, error } = await supabase
      .from('compliance_issues')
      .select('*, audits(title), departments(name), profiles(name)');
    if (error) throw error;

    return data.map(i => ({
      ...i,
      auditTitle: i.audits?.title || 'Unknown',
      department: i.departments?.name || 'Unknown',
      owner: i.profiles?.name || 'Unknown'
    }));
  },

  async acknowledgePolicy(orgId, policyId, employeeId) {
    const { data, error } = await supabase
      .from('policy_acknowledgements')
      .insert({
        org_id: orgId,
        policy_id: policyId,
        employee_id: employeeId,
        date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addAudit(orgId, title, departmentId, auditorId, findings) {
    const { data, error } = await supabase
      .from('audits')
      .insert({
        org_id: orgId,
        title,
        department_id: departmentId,
        auditor_id: auditorId,
        findings,
        date: new Date().toISOString().split('T')[0],
        status: 'Under Review'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createComplianceIssue(orgId, auditId, issue, severity, departmentId, ownerId, dueDate) {
    const { data, error } = await supabase
      .from('compliance_issues')
      .insert({
        org_id: orgId,
        audit_id: auditId,
        issue,
        severity,
        department_id: departmentId,
        owner_id: ownerId,
        due_date: dueDate,
        status: 'Open'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async resolveComplianceIssue(issueId) {
    const { data, error } = await supabase
      .from('compliance_issues')
      .update({ status: 'Resolved' })
      .eq('id', issueId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

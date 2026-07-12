import { supabase } from './supabaseClient';

export const environmentalService = {
  async fetchEmissionFactors() {
    const { data, error } = await supabase.from('emission_factors').select('*');
    if (error) throw error;
    return data;
  },

  async fetchProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  },

  async fetchEnvironmentalGoals() {
    const { data, error } = await supabase.from('environmental_goals').select('*');
    if (error) throw error;
    return data;
  },

  async fetchCarbonTransactions() {
    const { data, error } = await supabase.from('carbon_transactions').select('*').order('date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addEmissionFactor(orgId, name, category, co2PerUnit, unit) {
    const { data, error } = await supabase
      .from('emission_factors')
      .insert({
        org_id: orgId,
        name,
        category,
        co2_per_unit: parseFloat(co2PerUnit),
        unit
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addEnvironmentalGoal(orgId, name, departmentId, targetCo2, deadline) {
    const { data, error } = await supabase
      .from('environmental_goals')
      .insert({
        org_id: orgId,
        name,
        department_id: departmentId,
        target_co2: parseFloat(targetCo2),
        current_co2: 0,
        deadline,
        status: 'Active'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async logEmissionsTransaction(orgId, type, quantity, unit, factorName, co2Value, departmentId, date) {
    const { data, error } = await supabase
      .from('carbon_transactions')
      .insert({
        org_id: orgId,
        date: date || new Date().toISOString().split('T')[0],
        type,
        quantity: parseFloat(quantity),
        unit,
        emission_factor_name: factorName,
        co2_value: parseFloat(co2Value),
        status: 'Active',
        department_id: departmentId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateGoalProgress(goalId, currentCo2, status) {
    const { data, error } = await supabase
      .from('environmental_goals')
      .update({
        current_co2: parseFloat(currentCo2),
        status
      })
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

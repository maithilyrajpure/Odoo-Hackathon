import { supabase } from './supabaseClient';

export const notificationsService = {
  async fetchNotifications(orgId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });
      if (error) {
        throw error;
      }
      return data || [];
    } catch (err) {
      console.warn("Supabase notifications table not available, falling back to LocalStorage:", err.message);
      const local = localStorage.getItem(`esg_notifications_${orgId}`);
      return local ? JSON.parse(local) : [];
    }
  },

  async addNotification(orgId, type, message) {
    const newNotif = {
      id: String(Date.now()),
      org_id: orgId,
      type,
      message,
      date: new Date().toLocaleDateString(),
      created_at: new Date().toISOString()
    };
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(newNotif)
        .select()
        .single();
      if (error) {
        throw error;
      }
      return data;
    } catch (err) {
      console.warn("Supabase notifications table not available, saving to LocalStorage:", err.message);
      const local = localStorage.getItem(`esg_notifications_${orgId}`);
      const list = local ? JSON.parse(local) : [];
      const updatedList = [newNotif, ...list];
      localStorage.setItem(`esg_notifications_${orgId}`, JSON.stringify(updatedList));
      return newNotif;
    }
  }
};

import api from './api';
import { extractErrorMessage } from '../utils/apiHelpers';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const MOCK_SETTINGS_KEY = 'aobnap_mock_settings';

const DEFAULT_SETTINGS = {
  owner_dashboard_title: 'Gabatee',
  owner_dashboard_message: 'Baga nagaan dhuftan. Kunoo ilaalchi waligalaa iyyata maqaa daldalaa keessanii.',
  owner_recent_apps_title: 'Iyyata Yeroo Dhihoo',
  owner_new_app_title: 'Iyyata Daldala Haaraa',
  owner_new_app_message: 'Maqaa daldala keessanii eeyyamamuuf tarkaanfiiwwan hunda xumuraa.',
  owner_applications_title: 'Iyyata Hunda',
  owner_applications_message: 'Iyyata maqaa daldalaa keessanii hunda asitti to\'adhaa.',
  owner_approval_msg_title: 'Ergaa Ragga',
  owner_approval_msg_message: 'Ergaawwan mirkaneessa ykn kufaa ta\'uu iyyata keessanii asitti to\'adhaa.',
  admin_dashboard_title: 'Admin Dashboard',
  admin_dashboard_message: 'System overview and management',
  turizm_dashboard_title: 'Waajira Aadaaf Turizimii Dashboard',
  turizm_dashboard_message: 'Review business descriptions for Afaan Oromo language compliance',
  turizm_approve_message: 'You are about to approve the language compliance for this business description.',
  turizm_reject_message: 'You are about to reject this application.',
  commercial_dashboard_title: 'Waajira Daldaala Dashboard',
  commercial_approve_message: 'You are about to approve the commercial compliance for this business permit.',
  commercial_reject_message: 'You are about to reject this application.',
  communication_dashboard_title: 'Waajira Kominikeeshinii Dashboard',
  communication_accept_message: 'You are about to accept this application. A message will be sent to the business owner explaining why it was accepted.',
  communication_reject_message: 'You are about to reject this application. A message will be sent to the business owner explaining why it was rejected.'
};

export async function getSettings() {
  if (USE_MOCK) {
    let settings = localStorage.getItem(MOCK_SETTINGS_KEY);
    if (!settings) {
      localStorage.setItem(MOCK_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      settings = JSON.stringify(DEFAULT_SETTINGS);
    }
    return { success: true, data: JSON.parse(settings) };
  }

  try {
    const res = await api.get('/settings');
    return { success: true, data: res.data.data };
  } catch (error) {
    return { success: false, message: extractErrorMessage(error) };
  }
}

export async function bulkUpdateSettings(settingsObj) {
  if (USE_MOCK) {
    let settings = localStorage.getItem(MOCK_SETTINGS_KEY);
    const current = settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
    const updated = { ...current, ...settingsObj };
    localStorage.setItem(MOCK_SETTINGS_KEY, JSON.stringify(updated));
    return { success: true, message: 'Settings updated successfully' };
  }

  try {
    const res = await api.put('/settings/bulk', settingsObj);
    return { success: true, message: res.data.message };
  } catch (error) {
    throw { response: { data: { message: extractErrorMessage(error) } } };
  }
}


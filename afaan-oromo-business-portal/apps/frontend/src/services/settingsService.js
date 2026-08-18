import api from './api';
import { extractErrorMessage } from '../utils/apiHelpers';

export async function getSettings() {
  try {
    const res = await api.get('/settings');
    return { success: true, data: res.data.data };
  } catch (error) {
    return { success: false, message: extractErrorMessage(error) };
  }
}

export async function bulkUpdateSettings(settingsObj) {
  try {
    const res = await api.put('/settings/bulk', settingsObj);
    return { success: true, message: res.data.message };
  } catch (error) {
    throw { response: { data: { message: extractErrorMessage(error) } } };
  }
}

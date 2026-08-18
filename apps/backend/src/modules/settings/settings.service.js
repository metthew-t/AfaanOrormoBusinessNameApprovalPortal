const prisma = require('../../config/database');

/**
 * Get all system settings
 */
async function getAllSettings() {
  const settings = await prisma.systemSetting.findMany();
  // Return as a key-value object for easy frontend consumption
  const config = {};
  for (const s of settings) {
    config[s.key] = s.value;
  }
  return config;
}

/**
 * Update a setting or create it if it doesn't exist
 */
async function updateSetting(key, value, category = 'general') {
  return await prisma.systemSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value, category },
  });
}

/**
 * Update multiple settings at once
 */
async function bulkUpdateSettings(settingsObj) {
  const results = [];
  for (const [key, value] of Object.entries(settingsObj)) {
    const updated = await updateSetting(key, value);
    results.push(updated);
  }
  return results;
}

module.exports = {
  getAllSettings,
  updateSetting,
  bulkUpdateSettings,
};

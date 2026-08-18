const settingsService = require('./settings.service');

async function getSettings(req, res, next) {
  try {
    const config = await settingsService.getAllSettings();
    res.json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
}

async function bulkUpdate(req, res, next) {
  try {
    const updates = req.body;
    await settingsService.bulkUpdateSettings(updates);
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSettings,
  bulkUpdate,
};

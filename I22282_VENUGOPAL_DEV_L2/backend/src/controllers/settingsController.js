let settings = {
  theme: 'light',
  notifications: true,
  language: 'en',
};

exports.getSettings = (req, res) => {
  res.json(settings);
};

exports.updateSettings = (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
}; 
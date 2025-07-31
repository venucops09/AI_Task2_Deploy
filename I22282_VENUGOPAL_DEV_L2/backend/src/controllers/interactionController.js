const { validationResult } = require('express-validator');
const Interaction = require('../models/interaction');

exports.listInteractions = async (req, res) => {
  try {
    const interactions = await Interaction.findAll();
    res.json(interactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
};

exports.getInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.findByPk(req.params.id);
    if (!interaction) return res.status(404).json({ error: 'Interaction not found' });
    res.json(interaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interaction' });
  }
};

exports.createInteraction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const interaction = await Interaction.create(req.body);
    res.json(interaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create interaction' });
  }
};

exports.updateInteraction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const interaction = await Interaction.findByPk(req.params.id);
    if (!interaction) return res.status(404).json({ error: 'Interaction not found' });
    await interaction.update(req.body);
    res.json(interaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update interaction' });
  }
};

exports.deleteInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.findByPk(req.params.id);
    if (!interaction) return res.status(404).json({ error: 'Interaction not found' });
    await interaction.destroy();
    res.json({ message: 'Interaction deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete interaction' });
  }
}; 
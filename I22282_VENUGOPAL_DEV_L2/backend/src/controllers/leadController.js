const { validationResult } = require('express-validator');
const Lead = require('../models/lead');
const { Op } = require('sequelize');

const STAGES = ['Lead', 'Qualified', 'Proposal', 'Closed'];
const ALLOWED_TRANSITIONS = {
  Lead: 'Qualified',
  Qualified: 'Proposal',
  Proposal: 'Closed',
};

exports.listLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status;
    const where = {
      ...(search && {
        [Op.or]: [
          { source: { [Op.iLike]: `%${search}%` } },
        ],
      }),
      ...(status && { status }),
    };
    const { rows, count } = await Lead.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });
    res.json({
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
};

exports.createLead = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    // Default to 'Lead' stage if not provided
    const status = req.body.status || 'Lead';
    if (!STAGES.includes(status)) {
      return res.status(400).json({ error: 'Invalid initial stage' });
    }
    const lead = await Lead.create({ ...req.body, status });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create lead' });
  }
};

exports.updateLead = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    if (req.body.status && req.body.status !== lead.status) {
      // Enforce allowed transitions
      const nextAllowed = ALLOWED_TRANSITIONS[lead.status];
      if (req.body.status !== nextAllowed) {
        return res.status(400).json({ error: `Invalid stage transition from ${lead.status} to ${req.body.status}` });
      }
    }
    await lead.update(req.body);
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    await lead.destroy();
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
}; 
const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const leadController = require('../controllers/leadController');

router.get('/', leadController.listLeads);
router.get('/:id', [param('id').isInt()], leadController.getLead);
router.post('/', [
  body('customer_id').isInt(),
  body('status').notEmpty(),
  body('source').optional().isString(),
  body('assigned_to').optional().isInt(),
], leadController.createLead);
router.put('/:id', [
  param('id').isInt(),
  body('customer_id').optional().isInt(),
  body('status').optional().notEmpty(),
  body('source').optional().isString(),
  body('assigned_to').optional().isInt(),
], leadController.updateLead);
router.delete('/:id', [param('id').isInt()], leadController.deleteLead);

module.exports = router; 
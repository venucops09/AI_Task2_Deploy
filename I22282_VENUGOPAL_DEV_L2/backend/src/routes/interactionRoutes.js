const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const interactionController = require('../controllers/interactionController');

router.get('/', interactionController.listInteractions);
router.get('/:id', [param('id').isInt()], interactionController.getInteraction);
router.post('/', [
  body('customer_id').isInt(),
  body('type').notEmpty(),
  body('user_id').optional().isInt(),
  body('notes').optional().isString(),
], interactionController.createInteraction);
router.put('/:id', [
  param('id').isInt(),
  body('customer_id').optional().isInt(),
  body('type').optional().notEmpty(),
  body('user_id').optional().isInt(),
  body('notes').optional().isString(),
], interactionController.updateInteraction);
router.delete('/:id', [param('id').isInt()], interactionController.deleteInteraction);

module.exports = router; 
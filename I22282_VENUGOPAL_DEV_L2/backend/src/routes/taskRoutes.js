const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.listTasks);
router.get('/:id', [param('id').isInt()], taskController.getTask);
router.post('/', [
  body('title').notEmpty(),
  body('status').notEmpty(),
  body('assigned_to').optional().isInt(),
  body('customer_id').optional().isInt(),
], taskController.createTask);
router.put('/:id', [
  param('id').isInt(),
  body('title').optional().notEmpty(),
  body('status').optional().notEmpty(),
  body('assigned_to').optional().isInt(),
  body('customer_id').optional().isInt(),
], taskController.updateTask);
router.delete('/:id', [param('id').isInt()], taskController.deleteTask);

module.exports = router; 
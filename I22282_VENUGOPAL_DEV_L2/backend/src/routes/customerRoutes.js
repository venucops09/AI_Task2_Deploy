const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.listCustomers);
router.get('/:id', [param('id').isInt()], customerController.getCustomer);
router.post('/', [
  body('name').trim().escape().notEmpty(),
  body('email').optional().normalizeEmail().isEmail(),
  body('phone').optional().trim().escape(),
  body('address').optional().trim().escape(),
  body('company').optional().trim().escape(),
], customerController.createCustomer);
router.put('/:id', [
  param('id').isInt(),
  body('name').optional().trim().escape().notEmpty(),
  body('email').optional().normalizeEmail().isEmail(),
  body('phone').optional().trim().escape(),
  body('address').optional().trim().escape(),
  body('company').optional().trim().escape(),
], customerController.updateCustomer);
router.delete('/:id', [param('id').isInt()], customerController.deleteCustomer);

module.exports = router; 
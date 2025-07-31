const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.get('/sales', reportsController.salesReport);
router.get('/activities', reportsController.activitiesReport);
router.get('/customers', reportsController.customersReport);

module.exports = router; 
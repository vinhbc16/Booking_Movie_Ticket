const express = require('express');
const router = express.Router();
const { getDashboardStats, getQuickStats } = require('../../controllers/admin/dashboardController');
const authenticationMiddleware = require('../../middlewares/authentication');
const roleMiddleware = require('../../middlewares/role');

router.use(authenticationMiddleware, roleMiddleware(['admin']));
router.route('/stats').get(getDashboardStats);
router.route('/quick-stats').get(getQuickStats);

module.exports = router;

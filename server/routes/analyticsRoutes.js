// PATH: server/routes/analyticsRoutes.js  (NEW FILE)
const express = require('express');
const { getDashboardAnalytics, runScheduledJobsNow } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

router.get('/dashboard', protect, adminOnly, getDashboardAnalytics);
router.post('/run-jobs', protect, adminOnly, runScheduledJobsNow);

module.exports = router;
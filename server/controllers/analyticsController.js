// PATH: server/controllers/analyticsController.js  (NEW FILE)
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const { sendAbandonedCartReminders, sendLowStockAlert } = require('../services/cronJobs');

// GET /api/analytics/dashboard   (admin)
// Returns revenue-by-day for the last 30 days and the top 5 products by units sold.
// Cancelled orders are excluded from revenue so refunded/void orders don't inflate it.
const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const revenueByDay = await Order.aggregate([
    { $match: { createdAt: { $gte: since }, status: { $ne: 'Cancelled' } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.name',
        unitsSold: { $sum: '$items.qty' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
      },
    },
    { $sort: { unitsSold: -1 } },
    { $limit: 5 },
  ]);

  res.json({
    revenueByDay: revenueByDay.map((d) => ({ date: d._id, revenue: d.revenue, orders: d.orders })),
    topProducts: topProducts.map((p) => ({ name: p._id, unitsSold: p.unitsSold, revenue: p.revenue })),
  });
});

// POST /api/analytics/run-jobs   (admin) — manually fires the daily cron jobs
// on demand, so you can test/demo abandoned-cart and low-stock emails
// without waiting for the 10:00 schedule.
const runScheduledJobsNow = asyncHandler(async (req, res) => {
  await sendAbandonedCartReminders();
  await sendLowStockAlert();
  res.json({ message: 'Abandoned cart and low stock jobs ran successfully — check your email.' });
});

module.exports = { getDashboardAnalytics, runScheduledJobsNow };
// PATH: server/services/cronJobs.js  (NEW FILE)
const cron = require('node-cron');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { abandonedCartEmail, lowStockAlertEmail } = require('./emailTemplates');

const LOW_STOCK_THRESHOLD = 5;
const ABANDONED_AFTER_HOURS = 24;

// Emails anyone whose cart has sat untouched for 24h+ and hasn't already
// gotten a reminder for this same idle period.
async function sendAbandonedCartReminders() {
  const cutoff = new Date(Date.now() - ABANDONED_AFTER_HOURS * 60 * 60 * 1000);

  const carts = await Cart.find({
    'items.0': { $exists: true },
    updatedAt: { $lte: cutoff },
    $or: [{ lastReminderSentAt: null }, { lastReminderSentAt: { $lt: cutoff } }],
  }).populate('items.product user');

  for (const cart of carts) {
    if (!cart.user) continue;
    const items = cart.items.filter((i) => i.product).map((i) => ({ name: i.product.name, price: i.product.price, qty: i.qty }));
    if (items.length === 0) continue;

    try {
      await sendEmail({
        to: cart.user.email,
        subject: 'You left something in your Fortify cart',
        html: abandonedCartEmail(cart.user.name, items),
      });
      cart.lastReminderSentAt = new Date();
      await cart.save();
    } catch (err) {
      console.error(`Abandoned cart email failed for ${cart.user.email}:`, err.message);
    }
  }

  console.log(`[cron] Abandoned cart reminders sent: ${carts.length}`);
}

// Emails every admin a single daily digest of low-stock products, rather
// than one email per product (which would spam on a bad day).
async function sendLowStockAlert() {
  const lowStockProducts = await Product.find({ stock: { $lte: LOW_STOCK_THRESHOLD } }).select('name stock');
  if (lowStockProducts.length === 0) return;

  const admins = await User.find({ role: 'admin' });
  for (const admin of admins) {
    try {
      await sendEmail({
        to: admin.email,
        subject: `Fortify: ${lowStockProducts.length} product(s) running low`,
        html: lowStockAlertEmail(lowStockProducts),
      });
    } catch (err) {
      console.error(`Low stock alert email failed for ${admin.email}:`, err.message);
    }
  }

  console.log(`[cron] Low stock alert sent for ${lowStockProducts.length} product(s) to ${admins.length} admin(s)`);
}

// Runs once a day at 10:00 server time. Render's free web service stays
// running (unlike some serverless platforms), so an in-process cron is fine
// here — for very high traffic you'd move this to a separate worker/queue.
function startCronJobs() {
  cron.schedule('0 10 * * *', async () => {
    console.log('[cron] Running daily jobs…');
    await sendAbandonedCartReminders().catch((err) => console.error('[cron] abandoned cart job failed:', err.message));
    await sendLowStockAlert().catch((err) => console.error('[cron] low stock job failed:', err.message));
  });
  console.log('[cron] Scheduled daily jobs at 10:00 server time');
}

module.exports = { startCronJobs, sendAbandonedCartReminders, sendLowStockAlert };
// Branded HTML email shells — every Fortify email uses this wrapper so
// tone/colors match the storefront (navy header, gold accent, cream body).
const shell = (title, bodyHtml) => `
<div style="background:#F2F2F2;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:#ffffff;">
    <tr>
      <td style="background:#0F1B2A;padding:28px 36px;text-align:center;">
        <span style="font-family:Georgia,serif;font-size:24px;letter-spacing:4px;color:#F2F2F2;">FORTIFY</span>
        <div style="font-size:9px;letter-spacing:3px;color:#D6A96F;margin-top:6px;text-transform:uppercase;">Strength in every stitch</div>
      </td>
    </tr>
    <tr>
      <td style="padding:36px;">
        <h2 style="font-family:Georgia,serif;color:#111111;font-size:22px;margin:0 0 16px;">${title}</h2>
        ${bodyHtml}
      </td>
    </tr>
    <tr>
      <td style="background:#0F1B2A;padding:20px 36px;text-align:center;">
        <span style="font-size:11px;color:#8891a0;">© 2026 Fortify — Shankar &amp; Brothers</span>
      </td>
    </tr>
  </table>
</div>`;

const button = (label, url) => `
  <a href="${url}" style="display:inline-block;background:#B7844A;color:#0F1B2A;text-decoration:none;
    padding:12px 28px;font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;margin-top:8px;">
    ${label}
  </a>`;

const row = (label, value) => `
  <tr>
    <td style="padding:6px 0;color:#7A7A7A;font-size:13px;">${label}</td>
    <td style="padding:6px 0;color:#111111;font-size:13px;text-align:right;">${value}</td>
  </tr>`;

exports.welcomeEmail = (name) =>
  shell(
    `Welcome, ${name.split(' ')[0]}.`,
    `<p style="color:#444;font-size:14px;line-height:1.7;">
      Thanks for creating a Fortify account. You're all set to shop backpacks, luggage
      and everyday carry built to outlast the trip.
    </p>
    ${button('Start Shopping', process.env.CLIENT_URL + '/shop')}`
  );

exports.passwordResetEmail = (otp) =>
  shell(
    'Reset your password',
    `<p style="color:#444;font-size:14px;line-height:1.7;">
      Use the code below to reset your Fortify password. It expires in 10 minutes.
    </p>
    <div style="background:#F7F5F1;border:1px dashed #B7844A;text-align:center;padding:18px;
      font-size:28px;letter-spacing:8px;font-weight:bold;color:#0F1B2A;margin:16px 0;">
      ${otp}
    </div>
    <p style="color:#7A7A7A;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>`
  );

exports.orderPlacedEmail = (order) =>
  shell(
    'Order Confirmed',
    `<p style="color:#444;font-size:14px;line-height:1.7;">
      Thanks for your order — we're getting it ready. Order <b>#${order._id.toString().slice(-6).toUpperCase()}</b>.
    </p>
    <table role="presentation" width="100%" style="margin:16px 0;border-top:1px solid #eee;">
      ${order.items.map((i) => row(`${i.name} × ${i.qty}`, `₹${(i.price * i.qty).toLocaleString('en-IN')}`)).join('')}
      ${order.discount ? row('Coupon discount', `−₹${order.discount.toLocaleString('en-IN')}`) : ''}
      ${row('<b>Total</b>', `<b>₹${order.totalPrice.toLocaleString('en-IN')}</b>`)}
    </table>
    ${button('Track Your Order', process.env.CLIENT_URL + '/orders')}`
  );

exports.orderStatusEmail = (order) =>
  shell(
    `Order ${order.status}`,
    `<p style="color:#444;font-size:14px;line-height:1.7;">
      Your order <b>#${order._id.toString().slice(-6).toUpperCase()}</b> is now
      <b style="color:#B7844A;">${order.status}</b>.
    </p>
    ${button('View Order', process.env.CLIENT_URL + '/orders')}`
  );

exports.abandonedCartEmail = (name, items) =>
  shell(
    `Still thinking it over, ${name.split(' ')[0]}?`,
    `<p style="color:#444;font-size:14px;line-height:1.7;">
      You left a few things in your Fortify cart. They're still here whenever you're ready.
    </p>
    <table role="presentation" width="100%" style="margin:16px 0;border-top:1px solid #eee;">
      ${items.map((i) => row(`${i.name} × ${i.qty}`, `₹${(i.price * i.qty).toLocaleString('en-IN')}`)).join('')}
    </table>
    ${button('Return to Your Cart', process.env.CLIENT_URL + '/cart')}`
  );

exports.lowStockAlertEmail = (products) =>
  shell(
    'Low stock alert',
    `<p style="color:#444;font-size:14px;line-height:1.7;">
      The following products are running low and may need restocking:
    </p>
    <table role="presentation" width="100%" style="margin:16px 0;border-top:1px solid #eee;">
      ${products.map((p) => row(p.name, `${p.stock} left`)).join('')}
    </table>
    ${button('Manage Inventory', process.env.CLIENT_URL + '/admin/products')}`
  );
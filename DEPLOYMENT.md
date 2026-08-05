# Deploying Fortify

This gets you from "runs on localhost" to "live on a real domain," using the
stack the README already assumes: **Vercel** (client) + **Render** (server) +
**MongoDB Atlas** (database) + **Cloudinary** + **Razorpay** + **Gmail SMTP**.

Do the steps in this order — each later step needs a value from the one before it.

---

## 1. MongoDB Atlas (free tier)

1. Create an account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → **Build a Database** → **M0 Free**.
2. **Database Access** → add a user with a password (save it).
3. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) — simplest for a first deploy; tighten later if you want.
4. **Connect** → **Drivers** → copy the connection string. It looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Add `/fortify` before the `?` so it targets a database named `fortify`:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/fortify?retryWrites=true&w=majority`

This full string is your `MONGO_URI`.

---

## 2. Google OAuth credentials (for "Continue with Google")

1. [console.cloud.google.com](https://console.cloud.google.com) → create a project (e.g. "Fortify").
2. **APIs & Services → OAuth consent screen** → External → fill in app name, support email → save.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID** → Application type: **Web application**.
4. **Authorized redirect URIs** — add both, you'll need them for local dev and prod:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:5001/api/auth/google/callback`
   - `https://<your-render-service>.onrender.com/api/auth/google/callback` (add this after step 5 once you know the real Render URL)
5. Save. Copy the **Client ID** and **Client Secret** → these are `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

---

## 3. Cloudinary (product image uploads)

1. Sign up free at [cloudinary.com](https://cloudinary.com).
2. Dashboard home page shows **Cloud Name**, **API Key**, **API Secret** directly — copy all three.

---

## 4. Razorpay (payments)

1. Sign up at [razorpay.com](https://razorpay.com) → for testing, stay in **Test Mode** (toggle top-right of the dashboard).
2. **Settings → API Keys → Generate Test Key** → copy the **Key ID** and **Key Secret**.
3. Test-mode card for checkout: `4111 1111 1111 1111`, any future expiry, any CVV.
4. Switch to live keys later once you're ready to accept real payments (requires KYC on Razorpay's side).

---

## 5. Gmail SMTP (transactional email)

Gmail requires an **App Password**, not your normal login password:

1. Turn on 2-Step Verification on the Gmail account you want to send from: [myaccount.google.com/security](https://myaccount.google.com/security).
2. [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) → generate one for "Mail" → copy the 16-character password.
3. `SMTP_USER` = that Gmail address, `SMTP_PASS` = the app password (not your real password).

*(For production at real volume, swap Nodemailer's transport for Resend or SendGrid instead — Gmail SMTP has low sending limits and is really meant for dev/small-scale use.)*

---

## 6. Deploy the server → Render

1. Push this repo to GitHub.
2. [render.com](https://render.com) → **New → Blueprint** → connect the repo. Render will detect `server/render.yaml` automatically.
3. Render creates the service but leaves anything marked `sync: false` blank — go to the service's **Environment** tab and fill in every value from steps 1–5 above (`MONGO_URI`, `GOOGLE_CLIENT_ID`, `CLOUDINARY_API_KEY`, etc.). `JWT_SECRET` is auto-generated for you.
4. For `CLIENT_URL`, put a placeholder for now (e.g. `http://localhost:3000`) — you'll update it after step 7.
5. Deploy. Once live, copy the service URL, e.g. `https://fortify-api.onrender.com`.
6. Go back to Google Cloud Console (step 2) and add `https://fortify-api.onrender.com/api/auth/google/callback` to the authorized redirect URIs, and set `GOOGLE_CALLBACK_URL` in Render to that same value.
7. Seed the database once, from your own machine, pointed at the live Atlas cluster:
   ```bash
   cd server
   MONGO_URI="<your atlas connection string>" node helpers/seed.js
   ```

*(No Dockerfile is required for Render's native Node runtime — `render.yaml` uses `npm install` / `node server.js` directly. The `Dockerfile` in `server/` is there if you'd rather deploy to Railway, AWS, or anywhere else that expects a container.)*

---

## 7. Deploy the client → Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → import the same GitHub repo.
2. **Root Directory** → set to `client` (this is a monorepo — Vercel needs to know where the Next.js app actually lives).
3. **Environment Variables** → add `NEXT_PUBLIC_API_URL` = `https://fortify-api.onrender.com/api` (your real Render URL from step 6).
4. Deploy. Vercel gives you a URL like `https://fortify.vercel.app` (or attach your own domain, e.g. `fortifybags.com`, under **Settings → Domains**).
5. Go back to Render → update `CLIENT_URL` to this real Vercel URL, and redeploy the server (Render redeploys automatically on env var changes).

---

## 8. Sanity check

- Visit your Vercel URL → sign up with email → confirm the welcome email arrives.
- Try "Continue with Google" → confirm it redirects back and logs you in.
- Add a product to cart as a customer → checkout with **RAZORPAY** → pay with the test card above → confirm the order shows as **Confirmed** in `/admin/orders`.
- In `/admin/products`, add a product with an uploaded image → confirm it appears on the storefront.

If any step fails, check the Render service logs (**Logs** tab) first — most first-deploy issues are a missing/mistyped env var.

---

## CI

`.github/workflows/ci.yml` runs on every push/PR to `main`: builds the client with `next build` and syntax-checks + load-tests the server (no live database needed). Render and Vercel both also auto-deploy on push to `main` by default — so a red CI check is your signal to fix something *before* it ships, not after.

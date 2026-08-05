# Fortify — Shankar & Brothers

Premium leather-goods e-commerce platform. Monorepo containing the customer-facing
web app and the API server.

## Stack

**Client** — Next.js 15 (App Router), Tailwind CSS, Redux Toolkit, React Query, Axios, React Hook Form, Framer Motion
**Server** — Node.js, Express, MongoDB (Mongoose), JWT, Passport (Google OAuth), Cloudinary, Nodemailer, Razorpay

## Brand tokens (from the Fortify logo pack — source of truth)

| Token | Value |
|---|---|
| Navy (primary) | `#0F1B2A` |
| Gold (secondary) | `#B7844A` |
| Black (text) | `#111111` |
| Cream (background) | `#F2F2F2` |
| Gray (muted) | `#7A7A7A` |
| Display font | Cinzel / Cormorant Garamond |
| Body font | Montserrat |

These are wired into `client/tailwind.config.js` — use `bg-navy`, `text-gold`, `font-display`, `font-body` etc. rather than hardcoding hex values.

## Getting started

### 1. Server
```bash
cd server
cp .env.example .env       # fill in your own values
npm install
npm run dev                # http://localhost:5000
```

### 2. Client
```bash
cd client
cp .env.local.example .env.local
npm install
npm run dev                # http://localhost:3000
```

MongoDB: point `MONGO_URI` at a local instance or a free MongoDB Atlas cluster.

## Folder structure

```
fortify/
├── client/                Next.js app
│   └── src/
│       ├── app/           routes (App Router)
│       ├── components/    reusable UI (buttons, cards, nav, footer)
│       ├── layouts/       shared page shells
│       ├── hooks/         custom React hooks
│       ├── redux/         Redux Toolkit store + slices
│       ├── services/      axios API clients (one file per resource)
│       ├── utils/         formatters, constants
│       ├── context/       React context providers
│       └── assets/        images, icons
│
└── server/                Express API
    ├── controllers/       request handlers, one per resource
    ├── routes/            Express routers, one per resource
    ├── middleware/         auth guard, admin guard, error handler
    ├── models/            Mongoose schemas
    ├── config/            db connection, passport strategy
    ├── services/          email, payment, upload helpers
    ├── helpers/           small pure functions
    ├── utils/             token generation, response shaping
    └── app.js / server.js  Express app + entrypoint
```

## Phase 2 status — extras (done)

Wishlist, coupons, and reviews are now real, wired features — not stubs:

**Server** — `models/Wishlist.js`, `Coupon.js` (with a `calculateDiscount()` method — flat or percentage, min order value, max discount cap, usage limit, expiry), `Review.js` (one per user per product, auto-recalculates the product's cached rating). Routes: `/api/wishlist`, `/api/coupons` (validate + admin CRUD), `/api/products/:id/reviews` (nested). `Order` now carries `couponCode`/`discount`, and `placeOrder` re-validates the coupon server-side and increments its usage count — never trusts a discount number sent from the client.

**Client** — `useWishlist` hook + `WishlistButton` (heart icon on cards and product detail) + `/wishlist` page, kept in sync via a background `WishlistSync` component. `CouponBox` in checkout (validates live, shows the discount, feeds the real order total). `ReviewSection` on product detail (list + authenticated review form). Admin gets a new **Coupons** tab (`/admin/coupons`) alongside Products and Orders.

Verified with a real `npm run build` — 20 routes, zero errors.

## Phase 1 status — design system (done)

The client is fully wired end to end and **builds cleanly** (`npm run build` — verified, 18 routes, zero errors). Every screen below is real, functional code, not a stub:

**UI kit** (`src/ui/`) — Button, Input, Select, Badge, Card, Modal, Spinner, Skeleton (line/card/table variants), Chip, QuantityStepper

**Components** (`src/components/`) — Navbar, MobileMenu, Footer, ProductCard, CategoryCard, ReviewCard, Breadcrumb, Pagination, EmptyState, ConfirmDialog, ProtectedRoute, ProductFormModal (admin CRUD)

**Sections** (`src/sections/`) — Hero, CategoryStrip, SectionHeading, FeaturedProducts, StoryBand, Newsletter

**Layouts** (`src/layouts/`) — MainLayout (customer-facing), AuthLayout (login/signup/reset), AdminLayout (sidebar shell, role-protected)

**Hooks** (`src/hooks/`) — useAuth, useCart, useToast, useDebounce, useLocalStorage, useModal, usePagination, useWindowSize

**Pages** (`src/app/`) — Home, Shop (filterable + paginated), Product detail, Cart, Checkout, Order success, My Orders, Login, Signup, Forgot/Reset password, Google OAuth callback, Our Story, Admin Dashboard, Admin Products (full CRUD), Admin Orders, custom 404, error boundary, loading state

Every one of these talks to the real Express API via the `services/` layer and React Query — point `NEXT_PUBLIC_API_URL` at a running server and it works.

**Deliberately not built**: wishlist, coupons, reviews CRUD, 360° product viewer, AI search/chat, multi-portal (employee/warehouse) split, and anything else from the "complete ecosystem" brainstorm. Those are real Phase 2+ features — worth adding once Phase 1 is deployed and you've used it for a bit, not before.

## Build order (recommended)

This scaffold matches the working frontend prototype already built. Suggested order to bring it to life:

1. **Auth** — register, login, JWT issue/verify, Google OAuth, forgot/reset password (email via Nodemailer)
2. **Products** — public list/detail + admin CRUD (Cloudinary image upload)
3. **Cart** — server-persisted cart tied to logged-in user
4. **Orders / Checkout** — place order, address, Razorpay payment intent, order status
5. **Admin dashboard** — protected routes, stats, order status updates
6. **Extras** — wishlist, coupons, reviews, email templates, analytics

Everything beyond step 6 (AI search, AR try-on, employee/warehouse portal, microservices split) is a real roadmap item, but only worth starting once steps 1–6 are live and deployed.

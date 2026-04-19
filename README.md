# 🍽️ UmmahEats — Halal Food Delivery Platform

A production-ready halal food delivery application built with modern technologies for the Indian market.

## 🛡️ Core Philosophy
All restaurants on UmmahEats are **halal verified**. The platform focuses on trust, simplicity, and accessibility for Indian users.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile App | React Native (Expo) + TypeScript |
| Backend API | NestJS (Modular Architecture) |
| Database | PostgreSQL + Prisma ORM |
| Auth | OTP-based (phone) + JWT |
| Payments | Razorpay (UPI, Cards, Net Banking) |
| Real-time | Socket.io (order tracking) |
| Notifications | Firebase Cloud Messaging |
| API Docs | Swagger (auto-generated) |

---

## 📁 Project Structure

```
khana/
├── apps/
│   ├── mobile/          # React Native Expo app
│   │   ├── app/         # Expo Router screens
│   │   └── src/         # Components, hooks, services, stores
│   └── server/          # NestJS backend
│       ├── src/         # Modules: auth, users, restaurants, menu, orders, payments, riders, admin, notifications
│       └── prisma/      # Schema + seed data
├── docker-compose.yml   # PostgreSQL
└── package.json         # Workspace root
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** (via Docker or local install)
- **Expo CLI**: `npm install -g expo-cli`

### 1. Clone & Install

```bash
cd khana

# Install all dependencies (workspace)
npm install
```

### 2. Start Database

**Option A: Docker** (recommended)
```bash
docker-compose up -d
```

**Option B: Local PostgreSQL**
Update `apps/server/.env` with your PostgreSQL connection string.

### 3. Setup Backend

```bash
cd apps/server

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed sample data
npx prisma db seed

# Start dev server
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger docs: `http://localhost:3000/api/docs`

### 4. Start Mobile App

```bash
cd apps/mobile

# Install dependencies
npm install

# Start Expo dev server
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) to run the app.

> **Note:** Razorpay payment requires `npx expo prebuild` and development builds. It won't work in Expo Go.

---

## 📱 Screens

| Screen | Description |
|--------|-------------|
| Splash | Animated brand splash with auto-redirect |
| Login | Phone + OTP authentication |
| Home | Restaurant listing with search |
| Restaurant Detail | Menu, reviews, halal badge |
| Cart | Item management, bill summary |
| Checkout | Address, payment method (COD/Razorpay) |
| Order Tracking | Real-time status with Socket.io |
| Orders | Order history |
| Profile | Settings & logout |

---

## 🔌 API Endpoints

### Auth
- `POST /auth/send-otp` — Send OTP to phone
- `POST /auth/verify-otp` — Verify & get JWT

### Restaurants
- `GET /restaurants` — List (with location filter)
- `GET /restaurants/:id` — Detail with menu

### Orders
- `POST /orders` — Create order
- `GET /orders/my` — User history
- `GET /orders/:id` — Order detail
- `PATCH /orders/:id/status` — Update status

### Payments
- `POST /payments/create` — Create Razorpay order
- `POST /payments/verify` — Verify signature

### Admin
- `GET /admin/analytics` — Dashboard stats
- `PATCH /admin/restaurants/:id/verify` — Toggle halal badge

---

## 🧑‍💻 Test Credentials (after seeding)

| Role | Phone |
|------|-------|
| Admin | 9999999999 |
| Restaurant Owner | 9000000001 |
| User | 9100000001 |

> OTPs are logged to the server console in development mode.

---

## 🔒 Environment Variables

### Server (`apps/server/.env`)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ummaheats
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
PORT=3000
```

### Mobile (`apps/mobile/.env`)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

## 📦 Database Models

User • Restaurant • MenuItem • Order • OrderItem • Payment • Rider • Review • OtpRecord

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and open a PR

---

**Built with ❤️ for the Ummah**
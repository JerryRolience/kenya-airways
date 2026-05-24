# Kenya Airways Online System ✈️

A comprehensive web-based flight booking and management system for Kenya Airways, built as part of the CSC 321 Individual Project.

---

## 📖 Overview

The Kenya Airways Online System enables users to search, book, and manage flights across Kenya Airways' global network. The system supports multiple cabin classes, interactive seat selection, passenger management, secure payment processing, and comprehensive administrative functions.

---

# ✨ Features

## 🌍 Public Features

- **Flight Search**
  - Search one-way and return flights
  - Flexible date selection
  - Route filtering

- **Interactive Booking**
  - 3-step booking wizard:
    1. Passengers
    2. Seats
    3. Review & Payment

- **Seat Selection**
  - Visual aircraft seat map
  - Real-time seat availability

- **Cabin Classes**
  - Executive Class (Class A)
  - Middle Class (Class B)
  - Economy Class (Class C)

- **Booking Management**
  - View bookings
  - Modify bookings
  - Cancel bookings

- **Careers Portal**
  - Browse available job openings
  - Submit applications online

- **Help Center**
  - Searchable documentation
  - FAQs
  - User guides

---

## 👤 User Dashboard

- Dashboard overview with statistics
- My Flights (upcoming and past)
- My Bookings
- My Applications
- Payment History
- Profile Management

---

## 🛠️ Admin Panel

### Dashboard

- Real-time statistics
- Recent activity tracking

### Employee Management

- Create employees
- Edit employee details
- Delete employees
- Role-based access control

### Job Openings

- Create openings
- Edit openings
- Close/Reopen positions

### Employee Matching

- Match employees to departments
- Automated assignment support

### Application Review

- Shortlist applicants
- Reject applicants
- Hire applicants

### Reports

- Printable ticket reports
- Successful matches reports

### Passenger Management

- View passenger profiles
- Manage passenger records

---

# 🧰 Technology Stack

| Layer            | Technology                 |
| ---------------- | -------------------------- |
| Framework        | Next.js 16 (App Router)    |
| Language         | TypeScript                 |
| Database         | PostgreSQL (Supabase)      |
| ORM              | Prisma 7                   |
| Authentication   | Clerk (Passwordless)       |
| Styling          | Tailwind CSS 4 + shadcn/ui |
| Form Management  | React Hook Form + Zod      |
| State Management | TanStack Query             |
| Deployment       | Vercel                     |

---

# 📋 Prerequisites

Before installing the project, ensure you have:

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL database (Local or Supabase)
- Clerk account for authentication

---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd kenya-airways
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file in the project root:

```env
# =========================
# DATABASE CONFIGURATION
# =========================

DATABASE_URL="postgresql://user:password@host:6543/dbname?pgbouncer=true&connection_limit=5"
DIRECT_URL="postgresql://user:password@host:5432/dbname"

# =========================
# CLERK AUTHENTICATION
# =========================

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth"

NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# =========================
# SUPER ADMIN CONFIGURATION
# =========================

SUPER_ADMIN_EMAIL="admin@kenyaairways.co.ke"
SUPER_ADMIN_PASSWORD="YourSecurePassword123!"
SUPER_ADMIN_FIRST_NAME="Kenya"
SUPER_ADMIN_LAST_NAME="Airways"
```

---

## 4️⃣ Generate Prisma Client

```bash
npx prisma generate
```

---

## 5️⃣ Run Database Migrations

```bash
npx prisma migrate dev
```

---

## 6️⃣ Seed the Database

```bash
npm run db:seed
```

---

## 7️⃣ Seed Super Admin

```bash
npm run db:seed:super-admin
```

---

## 8️⃣ Start Development Server

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

---

# 📜 Available Scripts

| Command                       | Description                           |
| ----------------------------- | ------------------------------------- |
| `npm run dev`                 | Start development server              |
| `npm run build`               | Build application for production      |
| `npm start`                   | Start production server               |
| `npm run db:seed`             | Seed all database data                |
| `npm run db:seed:super-admin` | Seed super admin user                 |
| `npm run db:seed:airports`    | Seed airports only                    |
| `npm run db:seed:layouts`     | Seed aircraft layouts only            |
| `npm run db:seed:flights`     | Seed flights, seat classes, and seats |
| `npm run db:seed:passengers`  | Seed passengers only                  |
| `npm run db:seed:employees`   | Seed employees only                   |
| `npm run db:seed:openings`    | Seed job openings only                |

---

# 📁 Project Structure

```text
kenya-airways/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public-facing pages
│   │   ├── page.tsx              # Homepage
│   │   ├── flights/              # Flight search & results
│   │   ├── booking/              # Booking wizard
│   │   ├── careers/              # Careers & job applications
│   │   └── help/                 # Help center
│   │
│   ├── (auth)/                   # Authentication pages
│   │
│   ├── (dashboard)/              # User dashboard
│   │   └── dashboard/
│   │       ├── page.tsx          # Dashboard overview
│   │       ├── flights/          # My Flights
│   │       ├── bookings/         # My Bookings
│   │       ├── applications/     # My Applications
│   │       ├── payments/         # Payment History
│   │       └── profile/          # User Profile
│   │
│   └── (admin)/                  # Admin panel
│       └── admin/
│           ├── page.tsx          # Admin dashboard
│           ├── employees/        # Employee management
│           ├── job-openings/     # Job openings
│           ├── matches/          # Employee matching
│           ├── applications/     # Application review
│           ├── tickets/          # Ticket reports
│           └── reports/          # Matching reports
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── forms/                    # Form components
│   ├── admin/                    # Admin components
│   ├── dashboard/                # Dashboard components
│   ├── booking/                  # Booking components
│   ├── flights/                  # Flight components
│   ├── careers/                  # Careers components
│   ├── help/                     # Help center components
│   └── global/                   # Shared global components
│
├── actions/                      # Server actions
├── hooks/                        # Custom hooks
├── lib/                          # Utility libraries
│
├── prisma/                       # Database configuration
│   ├── schema.prisma             # Prisma schema
│   ├── migrations/               # Database migrations
│   └── seed/                     # Seed scripts
│
├── types/                        # TypeScript definitions
├── validators/                   # Zod schemas
├── constants/                    # App constants
└── public/                       # Static assets
```

---

# 🔐 Authentication

The system uses **Clerk Passwordless Authentication** with the `signUpIfMissing` flow.

### Authentication Flow

1. User enters email address
2. Verification code is sent
3. User enters verification code
4. Clerk verifies user
5. If account exists → User signs in
6. If account does not exist → New account created automatically

---

# 👥 User Roles

| Role        | Access Level                         |
| ----------- | ------------------------------------ |
| PASSENGER   | Public pages, dashboard, bookings    |
| EMPLOYEE    | Passenger access + employee features |
| ADMIN       | Admin panel, reports, management     |
| SUPER_ADMIN | Full system access                   |

---

# 🚀 Deployment

The application is deployed using **Vercel**.

## Deployment Steps

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Set build command:

```bash
prisma generate && next build
```

5. Deploy project

---

# 📚 Documentation

- **User Manual**
  - Installation
  - Configuration
  - User guide

- **System Manual**
  - Technical architecture
  - Maintenance
  - Troubleshooting

- **HCI Evaluation**
  - Usability evaluation
  - UI/UX principles

---

# 🎓 Academic Information

This project was developed for educational purposes as part of the:

## CSC 321 Individual Project

The project demonstrates:

- Full-stack web development
- Database design
- Authentication systems
- Flight booking workflows
- Administrative management systems
- Responsive UI/UX design

---

# 📄 License

This project is created strictly for educational purposes.

© 2026 Kenya Airways Online System. All Rights Reserved.

---

# 👨‍💻 Developer

Developed by **Jerry Rolience**

---

# ⭐ Acknowledgements

Special thanks to:

- Kenya Airways inspiration
- Next.js documentation
- Prisma ORM
- Clerk Authentication
- Supabase
- Tailwind CSS
- shadcn/ui

---

# ✈️ System Highlights

✅ Flight Booking System  
✅ Interactive Seat Selection  
✅ Passenger Dashboard  
✅ Employee Management  
✅ Job Application Portal  
✅ Real-time Reports  
✅ Secure Authentication  
✅ Responsive Design  
✅ Modern Full-Stack Architecture

---

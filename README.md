<div align="center">

# 🔗 Opportunity Link-Up

### Your gateway to scholarships, jobs, internships, donations & resources — all in one place.

![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ECF8E?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Security](#-security) · [Contributing](#-contributing)

</div>

---

## 📌 Overview

**Opportunity Link-Up** is a centralized platform that aggregates and surfaces life-changing opportunities for students, job seekers, researchers, and communities. Instead of hunting across dozens of websites, users find everything in one place:

- 🎓 **Scholarships** — local and international funding opportunities
- 💼 **Jobs** — full-time, part-time, and remote roles
- 🧑‍💻 **Internships** — entry-level experience for students and fresh graduates
- 💰 **Donations** — grants and financial support for individuals and organizations
- 📚 **Resources** — free tools, courses, guides, and learning materials
- 💬 **WhatsApp Community** — join an active group to get opportunities delivered directly to your phone

> Built with a focus on accessibility, speed, and security — designed to serve users across Africa and beyond.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Search & Filter** | Instantly search listings by keyword, category, location, or deadline |
| 📂 **Multi-Category** | Scholarships, jobs, internships, donations, and resources in one hub |
| 💬 **WhatsApp Integration** | Direct link to WhatsApp community group for real-time opportunity alerts |
| 🔒 **Secure Admin Panel** | CSRF-protected, rate-limited admin dashboard for managing listings |
| 📶 **Offline-First** | In-memory store with Supabase sync — works even with poor connectivity |
| 🛡️ **Enterprise-Grade Security** | CSP headers, HSTS, scrypt password hashing, Row-Level Security on all DB tables |
| ⚡ **Blazing Fast** | Next.js App Router + React Server Components for near-instant page loads |
| 📱 **Fully Responsive** | Mobile-first design — works seamlessly on any screen size |

---

## 🛠 Tech Stack

### Framework & Language

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 14.2.15 | App Router, RSC, Route Handlers, SSR |
| [React](https://react.dev/) | 18.3 | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | 5.6 | Type-safe development |

### Styling

| Technology | Version | Purpose |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first styling with custom navy + gold design tokens |
| PostCSS + Autoprefixer | Latest | CSS processing and browser compatibility |

### Data & Authentication

| Technology | Purpose |
|---|---|
| [Supabase](https://supabase.com/) | Postgres database, Auth, and file Storage |
| `@supabase/ssr` | Server-side Supabase client for Next.js App Router |
| `@supabase/supabase-js` | Client-side Supabase SDK |
| Row-Level Security (RLS) | Lockdown policies on all database tables |
| In-memory store | Offline-first data layer with Supabase background sync |

### Security

| Measure | Implementation |
|---|---|
| Password hashing | `node:crypto` scrypt — salted, 64-byte key |
| Session management | Session registry with CSRF token validation |
| Brute-force protection | Rate-limit lockouts on auth endpoints |
| HTTP security headers | CSP, HSTS, X-Frame-Options, X-Content-Type-Options via `next.config.js` |

### Tooling

- **ESLint** + `eslint-config-next` — code quality and linting
- **npm** — package management
- **PowerShell scripts** — Windows deployment automation

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) `v18+`
- [npm](https://www.npmjs.com/) `v9+`
- A [Supabase](https://supabase.com/) account and project

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/opportunity-linkup.git
cd opportunity-linkup
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin (set a strong secret)
ADMIN_SECRET=your_secure_admin_secret
```

> ⚠️ **Never commit your `.env.local` file.** It is already included in `.gitignore`.

### 4. Set Up the Database

Run the SQL migrations in your Supabase project dashboard or via the Supabase CLI to create the required tables and enable Row-Level Security policies.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
opportunity-linkup/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth route group
│   ├── (public)/               # Public-facing pages
│   │   ├── scholarships/       # Scholarship listings
│   │   ├── jobs/               # Job listings
│   │   ├── internships/        # Internship listings
│   │   ├── donations/          # Donation opportunities
│   │   └── resources/          # Free resources
│   ├── admin/                  # Protected admin dashboard
│   ├── api/                    # Route Handlers (REST endpoints)
│   └── layout.tsx              # Root layout
├── components/                 # Reusable React components
│   ├── ui/                     # Base UI components
│   ├── listings/               # Opportunity card components
│   └── search/                 # Search & filter components
├── lib/                        # Utility functions & configs
│   ├── supabase/               # Supabase client setup
│   ├── auth/                   # Auth helpers & session logic
│   └── store/                  # In-memory store with Supabase sync
├── types/                      # TypeScript type definitions
├── public/                     # Static assets
├── styles/                     # Global styles
├── next.config.js              # Next.js config + security headers
├── tailwind.config.ts          # Tailwind config + custom tokens
└── tsconfig.json               # TypeScript config
```

---

## 🔐 Security

Opportunity Link-Up was built with security as a first-class concern:

- **Password Storage** — Admin passwords are hashed using `scrypt` (via Node's built-in `node:crypto`), with a random salt and 64-byte key. No plaintext passwords are ever stored.
- **Session Security** — Sessions are tracked in a server-side registry. CSRF tokens are validated on all state-changing requests.
- **Rate Limiting** — Login and sensitive endpoints are rate-limited to prevent brute-force attacks.
- **Row-Level Security** — Every Supabase table has RLS policies enforced at the database level, ensuring users can only access data they're authorized to see.
- **HTTP Headers** — The following headers are set globally via `next.config.js`:
  - `Content-Security-Policy` (CSP)
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy`

---

## 💬 WhatsApp Community

Join the **Opportunity Link-Up WhatsApp Group** to receive the latest scholarships, jobs, internships, and resources delivered directly to your phone.

> 📲 **[Join the WhatsApp Group →](#)** *(replace with your actual link)*

---

## 🗺 Roadmap

- [x] Multi-category listing system (scholarships, jobs, internships, donations, resources)
- [x] Search and filter functionality
- [x] Supabase database integration with RLS
- [x] Secure admin panel with CSRF + rate limiting
- [x] WhatsApp community group integration
- [x] Offline-first in-memory store
- [ ] Email newsletter subscription
- [ ] User accounts — save and bookmark opportunities
- [ ] Submit your own opportunity (community submissions)
- [ ] Deadline reminder notifications
- [ ] Mobile app (React Native)
- [ ] AI-powered opportunity recommendations

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please make sure your code passes ESLint before submitting: `npm run lint`

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Tasie Jubilant**



---

<div align="center">

Built with ❤️ to connect people with opportunities that change lives.

⭐ **Star this repo if you find it useful!** ⭐

</div>

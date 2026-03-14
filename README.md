# StockPilot 📦🤖

**StockPilot** is an AI-enhanced, modern Warehouse Management System (WMS) tailored for high-scale inventory tracking and automated warehouse operations. Built with a premium, sleek dark-mode aesthetic, it provides real-time insights, AI-powered forecasting, and intelligent restock alerts.

## ✨ Features

- **Real-Time Inventory Tracking:** Track 10,000+ SKUs across multiple warehouse locations.
- **AI Demand Forecasting:** Integrates with Groq AI to analyze stock trends and predict future inventory needs.
- **Automated Restock Triggers:** Set custom threshold levels and get intuitive alerts when stock falls below safety levels.
- **Role-Based Access Control:** Differentiated access for `Admin` and `Staff` users.
- **Modern Authentication:** Secure email/password and Google OAuth provided by Supabase.
- **Premium UI/UX:** Built with a highly polished dynamic interface, glassmorphism designs, micro-animations, and dynamic visual indicators.
- **Responsive Layout:** Works flawlessly across desktop and mobile viewing environments.

## 🛠️ Technology Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Directory)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
- **Components:** [shadcn/ui](https://ui.shadcn.com/) + Radix Primitives
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Backend & Auth:** [Supabase](https://supabase.com/)
- **AI Integration:** [Groq API](https://groq.com/) for large language model completion.
- **Language:** TypeScript

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Supabase Project
- A Groq API Key

### 2. Clone the Repository
```bash
git clone https://github.com/abdulhaque2005/CoreInventory-oddo-x-indus.git
cd CoreInventory-oddo-x-indus/stockpilot
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Environment Variables
Create a `.env.local` file in the `stockpilot` directory and add your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```text
stockpilot/
├── src/
│   ├── app/                 # Next.js App Router (Pages, Layouts, API routes)
│   │   ├── (auth)/          # Login, Signup, Auth Callback layouts
│   │   ├── (dashboard)/     # Protected dashboard pages
│   │   └── api/             # Backend API endpoints (AI integration)
│   ├── components/          # Reusable UI components
│   │   ├── layout/          # Sidebar, Header, Navigation
│   │   ├── providers/       # Context Providers (UserProvider, etc.)
│   │   └── ui/              # Shadcn primitive components
│   ├── lib/                 # Utility functions and configurations
│   │   ├── store.ts         # Zustand global state
│   │   └── supabase/        # Supabase client, server, and middleware
│   └── middleware.ts        # Next.js edge middleware for route protection
├── public/                  # Static assets (images, icons)
├── tailwind.config.ts       # Tailwind CSS configuration
└── components.json          # Shadcn configuration
```

## 🔐 Authentication Flow

StockPilot utilizes Supabase SSR (Server-Side Rendering) authentication:
- **Middleware:** `src/middleware.ts` guards protected routes (`/dashboard`, `/inventory`, etc.) redirecting unauthenticated users to `/login`.
- **Client Provider:** `src/components/providers/user-provider.tsx` handles real-time auth state changes and role allocation.
- **Server Actions:** Securely process logins and signups inside `src/app/(auth)/actions.ts`.

## 🎨 Design Philosophy

The aesthetic philosophy centers around a dark, immersive interface:
- **Colors:** Deep emerald and neutral slates provide a cyber-warehouse feel.
- **Layering:** Elements are layered using `backdrop-blur` and subtle opacity borders.
- **Feedback:** Every interactive element has smooth transition states.

---
*Built for Oddo Hackathon*
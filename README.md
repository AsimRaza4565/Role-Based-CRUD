# Role-Based CRUD (Next.js + MongoDB (with mongoose) + TypeScript + Tailwind)

A role & permission-based CRUD system built with **Next.js 14**, **TypeScript**, **MongoDB**, and **TailwindCSS**.  
It includes authentication, user management, role & permission assignment, and protected routes using Next.js middleware.

---

## 🚀 Features

- 🔑 Authentication with **NextAuth**
- 👤 User CRUD (create, update, delete users)
- 🛡 Role & Permission management
- 📄 Post & Event CRUD (with granular permissions: create, read, update, delete)
- 🔒 Middleware for protecting API routes and pages
- 🎨 UI with TailwindCSS

---

## ⚡ Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/AsimRaza4565/Role-Based-CRUD.git
   cd Role-Based-CRUD
   ```

2. Install dependencies:
   npm install

3. Copy .env.example to .env.local and set your environment variables:
   cp .env.example .env.local

4. Run the development server:
   npm run dev

📂 Folder Structure
.
├── app/ # Next.js App Router pages & API routes
├── components/ # Reusable UI components
├── lib/ # Utility functions (e.g., auth checks, db connect)
├── models/ # Mongoose models (Schemas)
├── middleware.ts # Middleware for role/permission checks
├── public/ # Static assets
├── styles/ # Global styles
└── README.md

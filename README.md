# 🍽️ QR Menu Platform

A multi-tenant SaaS platform for hotels and restaurants to create and manage digital menus with QR codes.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 📚 Documentation

- [Implementation Plan](./IMPLEMENTATION_PLAN.md)
- [Development Roadmap](./DEVELOPMENT_ROADMAP.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Platform Overview](./README_PLATFORM.md)
- [Get Started Guide](./GET_STARTED.md)

## 🏗️ Project Structure

```
qr-menu-platform/
├── backend/          # Node.js + Express + Prisma
├── frontend/         # React + TypeScript + Vite
└── docs/            # Documentation
```

## 🛠️ Tech Stack

**Backend**: Node.js, Express, Prisma, PostgreSQL, JWT  
**Frontend**: React, TypeScript, Vite, Tailwind CSS, Zustand  
**DevOps**: Nginx, PM2, Let's Encrypt

## 📄 License

MIT License

## 🤝 Contributing

See [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) for development guidelines.


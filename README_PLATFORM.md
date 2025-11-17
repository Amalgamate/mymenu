# 🍽️ QR Menu Platform - Multi-Tenant SaaS

> A comprehensive QR code-based digital menu platform that enables hotels, restaurants, and institutions to register and immediately start using digital menus without requiring any technical infrastructure.

---

## 📖 Project Overview

### What is This?

This platform transforms the traditional paper menu experience into a modern, contactless digital solution. Hotels and restaurants can:

1. **Register online** in minutes
2. **Upload their menu** with photos and prices
3. **Get a unique QR code** automatically
4. **Print and place** QR codes on tables/rooms
5. **Receive orders** via WhatsApp instantly

### Key Features

✅ **Multi-Tenant Architecture** - One platform, unlimited businesses  
✅ **Self-Service Registration** - No manual setup required  
✅ **Automatic QR Generation** - Unique code per business  
✅ **WhatsApp Integration** - No payment gateway needed (MVP)  
✅ **Custom Branding** - Each business gets their own look  
✅ **PWA Support** - Installable on customer phones  
✅ **Mobile-First Design** - Optimized for smartphones  
✅ **Zero Technical Skills** - Simple admin dashboard  

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    CUSTOMERS                            │
│  (Scan QR → View Menu → Add to Cart → Order WhatsApp)  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              FRONTEND (React PWA)                       │
│  • Landing Page                                         │
│  • Tenant Registration                                  │
│  • Customer Menu View (/{slug})                         │
│  • Tenant Admin Dashboard                               │
│  • Super Admin Panel                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           BACKEND (Node.js + Express)                   │
│  • Authentication (JWT)                                 │
│  • Tenant Management                                    │
│  • Menu CRUD Operations                                 │
│  • QR Code Generation                                   │
│  • File Upload (Images)                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            DATABASE (PostgreSQL)                        │
│  • Tenants (Hotels/Restaurants)                         │
│  • Users (Admins)                                       │
│  • Menu Items (with tenant_id)                          │
│  • Categories                                           │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Zustand (state management)
- React Router (routing)
- Axios (HTTP client)

**Backend**
- Node.js 18+
- Express.js
- Prisma ORM
- PostgreSQL
- JWT (authentication)
- Multer (file uploads)
- QRCode (QR generation)

**DevOps**
- VPS (Ubuntu 22.04)
- Nginx (reverse proxy)
- PM2 (process manager)
- Let's Encrypt (SSL)

---

## 📁 Project Structure

```
qr-menu-platform/
├── backend/
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Auth, tenant context
│   │   └── utils/           # QR generation, helpers
│   ├── uploads/             # User-uploaded files
│   └── prisma/              # Database schema
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Route components
│   │   ├── components/      # Reusable UI
│   │   ├── store/           # Zustand stores
│   │   ├── api/             # API client
│   │   └── hooks/           # Custom hooks
│   └── public/              # PWA assets
│
└── docs/                    # Documentation
    ├── IMPLEMENTATION_PLAN.md
    ├── DEVELOPMENT_ROADMAP.md
    ├── MIGRATION_GUIDE.md
    └── README_PLATFORM.md (this file)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/qr-menu-platform.git
cd qr-menu-platform

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev
```

### Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs (if implemented)

---

## 📚 Documentation

### For Developers

1. **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)**  
   Complete technical specification with database schema, API endpoints, user flows, and architecture decisions.

2. **[DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md)**  
   Week-by-week development guide with tasks, deliverables, and testing checklists.

3. **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)**  
   Explains transition from single-tenant to multi-tenant architecture with code examples.

4. **[qr-menu-blueprint.md](./qr-menu-blueprint.md)**  
   Original single-tenant system blueprint (reference).

5. **[qr-menu-code-snippets.md](./qr-menu-code-snippets.md)**  
   Code examples for menu module (reference).

### For Users

- **Hotel Admin Guide**: (To be created)
- **Customer FAQ**: (To be created)

---

## 🎯 Development Phases

### Phase 1: MVP (6 weeks) ✅ Current Focus

**Goal**: Launch functional multi-tenant platform

- [x] Multi-tenant database schema
- [x] Authentication system (JWT)
- [x] Tenant registration & management
- [x] Menu CRUD with tenant isolation
- [x] QR code generation
- [x] Customer menu view
- [x] WhatsApp checkout
- [x] Admin dashboard
- [x] Production deployment

**Success Criteria**: 10+ hotels registered and using the platform

### Phase 2: Enhanced Features (6 weeks)

- [ ] Subdomain routing (hotel.yourdomain.com)
- [ ] Analytics dashboard
- [ ] Category management
- [ ] Bulk menu import (CSV)
- [ ] Multi-language support
- [ ] Table/room numbers
- [ ] Email notifications

### Phase 3: Business Growth (Ongoing)

- [ ] Subscription plans & billing
- [ ] Payment integration (M-Pesa, Stripe)
- [ ] Staff accounts
- [ ] Order management system
- [ ] Kitchen display
- [ ] Inventory tracking
- [ ] Mobile apps (iOS/Android)

---

## 🔐 Security

### Implemented

✅ Password hashing (bcrypt)  
✅ JWT authentication  
✅ Tenant data isolation  
✅ Input validation  
✅ File upload restrictions  
✅ HTTPS in production  
✅ Environment variable secrets  

### Best Practices

- Never commit `.env` files
- Use strong JWT secrets (32+ characters)
- Implement rate limiting on auth endpoints
- Regular security audits
- Keep dependencies updated

---

## 🧪 Testing

### Manual Testing

See [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) for detailed testing scenarios.

### Automated Testing (Future)

- Unit tests (Jest)
- Integration tests (Supertest)
- E2E tests (Playwright)

---

## 🚀 Deployment

### Production Checklist

- [ ] VPS provisioned (Ubuntu 22.04)
- [ ] Domain name configured
- [ ] PostgreSQL installed and secured
- [ ] Node.js 18+ installed
- [ ] Nginx configured with SSL
- [ ] Environment variables set
- [ ] Database migrated
- [ ] PM2 running backend
- [ ] Frontend built and served
- [ ] Backups configured

### Deployment Commands

```bash
# Backend
cd backend
npm install --production
npx prisma migrate deploy
pm2 start dist/app.js --name qrmenu-api
pm2 save

# Frontend
cd frontend
npm install
npm run build
sudo cp -r dist/* /var/www/qrmenu/
```

---

## 💰 Business Model

### Pricing Strategy (Proposed)

| Plan | Price | Features |
|------|-------|----------|
| **Free Trial** | $0 (14 days) | 20 items, 1 admin |
| **Starter** | $10/month | 50 items, 2 admins, branding |
| **Professional** | $25/month | Unlimited items, analytics |
| **Enterprise** | Custom | Multi-location, API access |

### Revenue Projections

- **Year 1**: 50 paying customers = $500-1,250/month
- **Year 2**: 200 paying customers = $2,000-5,000/month
- **Year 3**: 500 paying customers = $5,000-12,500/month

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits

---

## 📞 Support

### For Developers

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: dev@yourplatform.com

### For Users

- **Help Center**: (To be created)
- **Email**: support@yourplatform.com
- **WhatsApp**: +254XXXXXXXXX

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

---

## 🙏 Acknowledgments

- Original blueprint inspiration from single-tenant QR menu system
- Built with modern web technologies
- Designed for African market (WhatsApp-first approach)

---

## 🗺️ Roadmap

### Q1 2024
- ✅ Complete MVP development
- ✅ Deploy to production
- ✅ Onboard first 10 hotels

### Q2 2024
- [ ] Launch Phase 2 features
- [ ] Implement subscription billing
- [ ] Reach 50 paying customers

### Q3 2024
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics
- [ ] API for integrations

### Q4 2024
- [ ] Multi-country expansion
- [ ] Enterprise features
- [ ] Partner program

---

## 📊 Current Status

**Version**: 1.0.0-alpha  
**Status**: In Development  
**Last Updated**: 2024-01-XX  

---

**Built with ❤️ for the hospitality industry**

🚀 **Ready to revolutionize digital menus!**


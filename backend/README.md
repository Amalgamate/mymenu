# QR Menu Platform - Backend

Node.js + Express + Prisma backend for the QR Menu Platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, tenant context, uploads
│   ├── utils/           # Helper functions
│   ├── config/          # Configuration files
│   └── app.ts           # Express application
├── prisma/
│   └── schema.prisma    # Database schema
├── uploads/             # User-uploaded files
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## 🗄️ Database

The application uses PostgreSQL with Prisma ORM. The schema includes:

- **Tenants** - Hotels, restaurants, cafes
- **Users** - Admin users per tenant
- **MenuItems** - Menu items per tenant
- **Categories** - Menu categories per tenant

### Multi-Tenant Architecture

All data is isolated by `tenant_id`. Middleware ensures users can only access their own tenant's data.

## 🔐 Authentication

JWT-based authentication with:
- Access tokens (15 min expiry)
- Refresh tokens (7 day expiry)
- Role-based access control (SUPER_ADMIN, TENANT_ADMIN, STAFF)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new tenant
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Tenants
- `GET /api/tenants/:id` - Get tenant details
- `PUT /api/tenants/:id` - Update tenant
- `GET /api/tenants/slug/:slug` - Get tenant by slug (public)

### Menu
- `GET /api/menu` - Get menu items (filtered by tenant)
- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### QR Codes
- `GET /api/qr/generate/:tenantId` - Generate QR code
- `GET /api/qr/download/:tenantId` - Download QR code

## 🔒 Environment Variables

See `.env.example` for all required environment variables.

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📝 License

MIT


# 🔄 Migration Guide: Single-Tenant → Multi-Tenant Platform

## Overview

This document explains the key differences between your current single-tenant QR menu system and the new multi-tenant SaaS platform.

---

## 🏗️ Architecture Changes

### Current (Single-Tenant)
```
One installation = One hotel/restaurant
- Single menu database
- One admin user
- One QR code
- Manual deployment per client
```

### New (Multi-Tenant)
```
One installation = Multiple hotels/restaurants
- Shared database with tenant isolation
- Multiple admin users (one per tenant)
- Multiple QR codes (one per tenant)
- Self-service registration
```

---

## 📊 Database Schema Changes

### Current Schema
```sql
MenuItem
- id
- name
- description
- price
- image_url
- category
- is_available
```

### New Schema (Enhanced)
```sql
-- NEW TABLE
Tenant
- id
- slug (unique)
- business_name
- whatsapp_number
- logo_url
- qr_code_url
- status

-- NEW TABLE
User
- id
- tenant_id (FK)
- email
- password_hash
- role

-- ENHANCED TABLE
MenuItem
- id
- tenant_id (FK) ← NEW: Links to tenant
- name
- description
- price
- image_url
- category
- is_available
```

**Key Change**: Every menu item now belongs to a specific tenant via `tenant_id` foreign key.

---

## 🔌 API Endpoint Changes

### Current APIs
```
GET    /api/menu          # Returns ALL menu items
POST   /api/menu          # Creates item (no tenant context)
PUT    /api/menu/:id      # Updates any item
DELETE /api/menu/:id      # Deletes any item
```

### New APIs (Multi-Tenant)
```
# Authentication (NEW)
POST   /api/auth/register      # Tenant registration
POST   /api/auth/login         # User login
GET    /api/auth/me            # Current user

# Tenant Management (NEW)
GET    /api/tenants/:id        # Get tenant details
PUT    /api/tenants/:id        # Update tenant
GET    /api/tenants/slug/:slug # Get tenant by slug (public)

# Menu (Enhanced with tenant filtering)
GET    /api/menu?tenant_id=X   # Returns items for specific tenant
POST   /api/menu               # Creates item (tenant from JWT)
PUT    /api/menu/:id           # Updates item (validates ownership)
DELETE /api/menu/:id           # Deletes item (validates ownership)

# QR Codes (NEW)
GET    /api/qr/generate/:tenantId
GET    /api/qr/download/:tenantId
```

**Key Changes**:
- All menu operations now filtered by tenant
- Authentication required for admin operations
- Tenant context injected via middleware

---

## 🎨 Frontend Routing Changes

### Current Routes
```
/              → Menu (customer view)
/cart          → Shopping cart
/admin         → Admin dashboard (no auth)
/admin/menu    → Menu management
```

### New Routes (Multi-Tenant)
```
# Public Routes
/                        → Landing page (platform homepage)
/register                → Tenant registration
/login                   → User login
/{tenant-slug}           → Customer menu (dynamic per tenant)
/{tenant-slug}/cart      → Shopping cart

# Protected Routes (requires auth)
/admin                   → Tenant admin dashboard
/admin/menu              → Menu management
/admin/settings          → Tenant settings
/admin/qr-code           → QR code download

# Super Admin Routes
/super-admin             → Platform management
/super-admin/tenants     → All tenants list
```

**Key Changes**:
- Landing page for platform marketing
- Dynamic tenant routing (`/{slug}`)
- Authentication-protected admin routes
- Separate super admin area

---

## 🔐 Authentication Flow

### Current (No Auth)
```
User → Admin Dashboard (direct access)
```

### New (JWT-based Auth)
```
1. User → Login Page
2. Submit credentials
3. Backend validates → Returns JWT token
4. Token stored in httpOnly cookie
5. All admin requests include token
6. Middleware validates token + tenant access
7. If valid → Allow request
8. If invalid → Redirect to login
```

**Implementation**:
```typescript
// Frontend: Axios interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Backend: Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## 🛡️ Tenant Isolation Strategy

### How Data Isolation Works

#### 1. Middleware Injection
```javascript
// Tenant middleware (runs after auth)
const tenantMiddleware = (req, res, next) => {
  // Extract tenant from authenticated user
  const tenantId = req.user.tenant_id;
  
  // Inject into request context
  req.tenantId = tenantId;
  
  next();
};
```

#### 2. Query Filtering
```javascript
// OLD: Get all menu items (dangerous in multi-tenant)
const items = await MenuItem.findAll();

// NEW: Get only tenant's menu items
const items = await MenuItem.findAll({
  where: { tenant_id: req.tenantId }
});
```

#### 3. Creation with Tenant Context
```javascript
// OLD: Create item without tenant
const item = await MenuItem.create(req.body);

// NEW: Create item with tenant
const item = await MenuItem.create({
  ...req.body,
  tenant_id: req.tenantId  // Injected by middleware
});
```

#### 4. Update/Delete Validation
```javascript
// OLD: Update any item
const item = await MenuItem.findByPk(req.params.id);
await item.update(req.body);

// NEW: Validate ownership before update
const item = await MenuItem.findOne({
  where: { 
    id: req.params.id,
    tenant_id: req.tenantId  // Ensures user owns this item
  }
});

if (!item) {
  return res.status(404).json({ error: 'Item not found' });
}

await item.update(req.body);
```

---

## 🎯 QR Code Generation

### Current (Manual)
```
1. Use online QR generator
2. Enter URL: https://yourdomain.com
3. Download QR code
4. Print and place
```

### New (Automated)
```
1. Tenant registers
2. System auto-generates:
   - Unique slug: "hotel-paradise"
   - QR code pointing to: https://yourdomain.com/hotel-paradise
   - Saves QR code to: /uploads/qr-codes/{tenant-id}.png
3. Tenant downloads from admin dashboard
4. Print and place
```

**Implementation**:
```javascript
import QRCode from 'qrcode';

const generateQRCode = async (tenantId, slug) => {
  const url = `${process.env.PLATFORM_DOMAIN}/${slug}`;
  const qrPath = `uploads/qr-codes/${tenantId}.png`;
  
  await QRCode.toFile(qrPath, url, {
    width: 500,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  
  return `/qr-codes/${tenantId}.png`;
};
```

---

## 🎨 Branding Customization

### Current (Static)
```
- Fixed colors
- Fixed logo
- Fixed business name
```

### New (Dynamic per Tenant)
```javascript
// Fetch tenant branding
const tenant = await Tenant.findOne({ where: { slug } });

// Apply to menu page
<div style={{ 
  '--primary-color': tenant.primary_color,
  '--logo': `url(${tenant.logo_url})`
}}>
  <img src={tenant.logo_url} alt={tenant.business_name} />
  <h1>{tenant.business_name}</h1>
  {/* Menu items */}
</div>
```

**CSS Variables**:
```css
:root {
  --primary-color: #2563eb; /* Default */
}

.tenant-branded {
  --primary-color: var(--tenant-primary-color, #2563eb);
}

.btn-primary {
  background-color: var(--primary-color);
}
```

---

## 📦 Deployment Changes

### Current Deployment (Per Client)
```bash
# For each new client:
1. Clone repository
2. Set up new VPS
3. Configure database
4. Deploy code
5. Set up domain
6. Configure SSL

Cost: $10-20/month per client
Effort: 2-4 hours per client
```

### New Deployment (Platform)
```bash
# One-time setup:
1. Deploy platform to VPS
2. Configure main domain
3. Set up SSL

# For each new client:
1. Client registers online (self-service)
2. System auto-creates tenant
3. Client starts using immediately

Cost: $20-50/month for ALL clients
Effort: 0 hours per client (automated)
```

**Scalability**: Can serve 100+ tenants on single VPS.

---

## 🔄 Migration Steps (If You Have Existing Data)

### Step 1: Backup Current Data
```bash
pg_dump current_db > backup.sql
```

### Step 2: Create Multi-Tenant Schema
```bash
npx prisma migrate dev
```

### Step 3: Migrate Existing Data
```sql
-- Create a tenant for existing client
INSERT INTO tenants (id, slug, business_name, whatsapp_number)
VALUES (uuid_generate_v4(), 'existing-hotel', 'Existing Hotel', '+254712345678');

-- Update existing menu items with tenant_id
UPDATE menu_items 
SET tenant_id = (SELECT id FROM tenants WHERE slug = 'existing-hotel');
```

### Step 4: Create Admin User
```sql
INSERT INTO users (id, tenant_id, email, password_hash, role)
VALUES (
  uuid_generate_v4(),
  (SELECT id FROM tenants WHERE slug = 'existing-hotel'),
  'admin@existinghotel.com',
  '$2b$10$...', -- bcrypt hash of password
  'tenant_admin'
);
```

---

## ✅ Testing Multi-Tenant Isolation

### Test Scenario: Two Tenants
```javascript
// 1. Register two tenants
POST /api/auth/register
{ business_name: "Hotel A", email: "admin@hotela.com", ... }

POST /api/auth/register
{ business_name: "Hotel B", email: "admin@hotelb.com", ... }

// 2. Login as Hotel A admin
POST /api/auth/login
{ email: "admin@hotela.com", password: "..." }
// Save token_A

// 3. Create menu item as Hotel A
POST /api/menu
Headers: { Authorization: "Bearer token_A" }
Body: { name: "Pizza", price: 1000 }

// 4. Login as Hotel B admin
POST /api/auth/login
{ email: "admin@hotelb.com", password: "..." }
// Save token_B

// 5. Try to get Hotel A's menu items as Hotel B
GET /api/menu
Headers: { Authorization: "Bearer token_B" }

// Expected: Should NOT see Hotel A's pizza
// Should only see Hotel B's items (empty if none created)
```

---

## 🚀 Benefits of Multi-Tenant Architecture

### For You (Platform Owner)
✅ **Scalability**: Serve 100+ clients on one server  
✅ **Automation**: Zero manual deployment per client  
✅ **Revenue**: Recurring subscription model  
✅ **Maintenance**: Update once, all clients benefit  
✅ **Analytics**: Platform-wide insights  

### For Clients (Hotels)
✅ **Instant Setup**: Register and start in minutes  
✅ **No Technical Skills**: Fully managed platform  
✅ **Affordable**: Shared infrastructure = lower cost  
✅ **Always Updated**: Automatic feature rollouts  
✅ **Reliable**: Professional hosting and support  

---

## 📚 Additional Resources

- **Prisma Multi-Tenancy Guide**: https://www.prisma.io/docs/guides/database/multi-tenancy
- **JWT Best Practices**: https://tools.ietf.org/html/rfc8725
- **Node.js Security Checklist**: https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html

---

**Ready to migrate! Follow the implementation plan.** 🎯


# 🚀 Quick Start Guide - QR Menu Platform

Get your QR Menu Platform running in 10 minutes!

---

## Step 1: Set Up Supabase Database (5 minutes)

### 1.1 Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email

### 1.2 Create New Project
1. Click "New Project"
2. Fill in:
   - **Name:** `qr-menu-platform`
   - **Database Password:** Create a strong password (SAVE THIS!)
   - **Region:** Choose closest to you
3. Click "Create new project"
4. Wait 2-3 minutes for provisioning

### 1.3 Get Connection Strings
1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string**
3. Copy **Connection pooling** string (for migrations)
4. Copy **Direct connection** string (for Prisma)

### 1.4 Update Backend .env
1. Open `backend/.env`
2. Replace the placeholders:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
   ```
3. Replace `[YOUR-PASSWORD]` with your actual database password
4. Replace `xxxxx` with your project reference ID (from the connection string)

---

## Step 2: Initialize Database (2 minutes)

Open terminal in the `backend` folder:

```bash
cd backend

# Test database connection
npx ts-node src/test-db-connection.ts

# Create database tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

You should see:
- ✅ Connection successful
- ✅ Tables created: tenants, users, menu_items, categories

---

## Step 3: Start Backend Server (1 minute)

In the `backend` folder:

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
📚 Environment: development
🔗 Frontend URL: http://localhost:5173
```

**Keep this terminal open!**

---

## Step 4: Start Frontend (1 minute)

Open a **new terminal** in the `frontend` folder:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v7.2.2  ready in 676 ms
➜  Local:   http://localhost:5173/
```

**Keep this terminal open too!**

---

## Step 5: Test the Platform (1 minute)

### 5.1 Open the App
1. Open browser: http://localhost:5173
2. You should see the landing page

### 5.2 Register Your First Business
1. Click "Get Started" or "Register"
2. Fill in the form:
   - **Business Name:** "Test Restaurant"
   - **Business Type:** Restaurant
   - **WhatsApp:** +1234567890
   - **First Name:** Your name
   - **Last Name:** Your last name
   - **Email:** test@example.com
   - **Password:** password123
3. Click "Create Account"

### 5.3 View Admin Dashboard
- You should be redirected to `/admin`
- See your business name and stats
- Note your menu URL (e.g., `/test-restaurant`)

### 5.4 View Customer Menu
1. Open new tab: http://localhost:5173/test-restaurant
2. You should see your business menu (empty for now)

---

## 🎉 Success!

You now have a fully functional QR Menu Platform!

---

## What's Next?

### Add Your First Menu Item (Coming Soon)
The admin dashboard currently shows placeholders. To add menu items, you can:

**Option 1: Use API directly** (for now)
Use Thunder Client or Postman to test the API:
- POST `/api/menu` - Create menu item
- See `backend/API_DOCUMENTATION.md` for details

**Option 2: Wait for UI implementation**
The menu management UI will be added next

### Download Your QR Code
Use the API endpoint:
```
GET http://localhost:5000/api/qr/download/:tenantId
```
(Get your tenantId from the admin dashboard or database)

---

## Troubleshooting

### Backend won't start
- ✅ Check if port 5000 is available
- ✅ Verify `.env` file has correct database URLs
- ✅ Run `npm install` again

### Frontend won't start
- ✅ Check if port 5173 is available
- ✅ Verify `.env` file exists in frontend folder
- ✅ Run `npm install` again

### Database connection fails
- ✅ Check Supabase project is running
- ✅ Verify password in connection strings
- ✅ Check internet connection
- ✅ Try direct connection string instead

### Can't register
- ✅ Check backend is running
- ✅ Check browser console for errors
- ✅ Verify API URL in `frontend/.env`

---

## Useful Commands

### Backend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Run production build
npx prisma studio    # View database
npx prisma migrate   # Run migrations
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## Testing the API

### Using Thunder Client (VS Code)
1. Install Thunder Client extension
2. Import collection from `backend/API_DOCUMENTATION.md`
3. Test endpoints

### Using curl
```bash
# Health check
curl http://localhost:5000/health

# Register (example)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Test Hotel",
    "businessType": "HOTEL",
    "email": "test@hotel.com",
    "password": "password123",
    "whatsappNumber": "+1234567890",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

---

## 📚 More Resources

- `CURRENT_STATUS.md` - Complete project status
- `backend/API_DOCUMENTATION.md` - Full API reference
- `backend/SUPABASE_SETUP.md` - Detailed database setup
- `docs/IMPLEMENTATION_PLAN.md` - Technical architecture
- `docs/DEVELOPMENT_ROADMAP.md` - Development phases

---

## Need Help?

Check the documentation files or review the code comments!

**Happy coding! 🚀**


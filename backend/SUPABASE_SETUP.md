# 🗄️ Supabase Database Setup Guide

## Step-by-Step Instructions

### 1. Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

### 2. Create New Project

1. Click "New Project"
2. Fill in the details:
   - **Name**: `qr-menu-platform` (or your preferred name)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free (sufficient for development)
3. Click "Create new project"
4. Wait 2-3 minutes for provisioning

### 3. Get Connection Strings

Once your project is ready:

1. Click on **Settings** (gear icon in sidebar)
2. Go to **Database** section
3. Scroll to **Connection string**
4. You'll see two connection strings:

#### Connection Pooling (for Prisma migrations)
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### Direct Connection (for Prisma Client)
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 4. Update .env File

Open `backend/.env` and replace the placeholder values:

```env
# Database - Supabase
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Important**: Replace:
- `[YOUR-PASSWORD]` with your actual database password
- `[PROJECT-REF]` with your project reference (from Supabase)
- `[REGION]` with your region code

### 5. Run Database Migrations

Once you've updated the .env file:

```bash
# Generate Prisma client (if not done already)
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# Open Prisma Studio to view your database
npx prisma studio
```

### 6. Verify Setup

After running migrations, you should see these tables in Supabase:
- `tenants`
- `users`
- `menu_items`
- `categories`

You can view them in:
- **Supabase Dashboard** → Table Editor
- **Prisma Studio** → http://localhost:5555

---

## 🔒 Security Notes

1. **Never commit .env file** - It's already in .gitignore
2. **Use strong passwords** - For database access
3. **Enable Row Level Security** - In Supabase (optional for now)
4. **Rotate passwords regularly** - In production

---

## 🆘 Troubleshooting

### Error: "Can't reach database server"
- Check your internet connection
- Verify connection strings are correct
- Ensure Supabase project is active

### Error: "Authentication failed"
- Double-check your password
- Make sure there are no extra spaces in .env
- Password might need URL encoding if it has special characters

### Error: "SSL connection required"
- Add `?sslmode=require` to connection string
- Supabase requires SSL by default

---

## 📚 Useful Links

- **Supabase Dashboard**: https://app.supabase.com
- **Supabase Docs**: https://supabase.com/docs
- **Prisma + Supabase Guide**: https://supabase.com/docs/guides/integrations/prisma

---

## ✅ Next Steps After Setup

Once database is connected:
1. Run migrations
2. Create seed data
3. Test database connection
4. Build API routes and controllers
5. Start the backend server

---

**Need help?** Check the Supabase dashboard or Prisma documentation.


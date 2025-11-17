# 🟦 **QR MENU PWA + ADMIN DASHBOARD --- FULL SYSTEM BLUEPRINT**

### *(Production-ready Markdown for Augment Code)*

------------------------------------------------------------------------

# 🏨 **1. System Overview**

Create A lightweight QR-based hotel/restaurant menu ordering system.

### **Features**

-   PWA mobile menu\
-   Install-app prompt\
-   Browse categories & items\
-   Add to cart\
-   Checkout via WhatsApp (no API needed)\
-   Simple admin dashboard\
-   CRUD: Create, Edit, Delete menu items\
-   Upload images\
-   Multi-branch (optional future upgrade)\
-   Hosted on your VPS with Nginx + SSL

------------------------------------------------------------------------

# 🛠️ **2. Tech Stack**

### **Frontend (PWA + Admin)**

-   React (Vite)
-   TypeScript
-   Tailwind CSS
-   Zustand (state store)
-   Axios

### **Backend**

-   Node.js + Express
-   PostgreSQL (can start with SQLite)
-   Sequelize or Prisma ORM
-   Multer (file uploads)

### **Deployment**

-   VPS (Ubuntu 22.04+)
-   Nginx\
-   PM2 (Node process manager)
-   Git + CI for easy updates

------------------------------------------------------------------------

# 📁 **3. Project Folder Structure**

    qr-menu/
    │
    ├── backend/
    │   ├── src/
    │   │   ├── app.js
    │   │   ├── routes/
    │   │   │   └── menu.routes.js
    │   │   ├── controllers/
    │   │   │   └── menu.controller.js
    │   │   ├── models/
    │   │   │   └── menu.model.js
    │   │   ├── middleware/
    │   │   │   └── upload.js
    │   │   └── db.js
    │   ├── uploads/ (item images)
    │   └── package.json
    │
    ├── frontend/
    │   ├── public/
    │   │   ├── manifest.json
    │   │   ├── service-worker.js
    │   ├── src/
    │   │   ├── main.tsx
    │   │   ├── App.tsx
    │   │   ├── components/
    │   │   ├── pages/
    │   │   │   ├── Menu.tsx
    │   │   │   ├── Cart.tsx
    │   │   │   ├── AdminMenuList.tsx
    │   │   │   ├── AdminMenuForm.tsx
    │   │   ├── store/
    │   │   │   └── cart.store.ts
    │   │   └── api/
    │   │       └── menu.api.ts
    │   └── package.json
    │
    └── README.md

------------------------------------------------------------------------

# 🗄️ **4. Database Schema (Menu Items)**

    MenuItem
    - id (int, PK)
    - name (string)
    - description (text)
    - price (decimal)
    - image_url (string)
    - category (string)
    - is_available (boolean)
    - created_at
    - updated_at

------------------------------------------------------------------------

# 🔌 **5. Backend API (CRUD)**

  Method   Endpoint        Description
  -------- --------------- --------------------
  GET      /api/menu       Get all menu items
  GET      /api/menu/:id   Get single item
  POST     /api/menu       Create item
  PUT      /api/menu/:id   Update item
  DELETE   /api/menu/:id   Delete item
  POST     /api/upload     Upload image

------------------------------------------------------------------------

# 🖼️ **6. Backend Upload Middleware (Multer)**

``` js
import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export const upload = multer({ storage });
```

------------------------------------------------------------------------

# 🧩 **7. React PWA Setup**

### `public/manifest.json`

``` json
{
  "name": "QR Menu",
  "short_name": "Menu",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/pwa-icon.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### Install prompt in React

``` js
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
});
```

------------------------------------------------------------------------

# 🛒 **8. WhatsApp Checkout Logic**

``` ts
export function sendToWhatsApp(order, hotelNumber) {
  const message =
    `Order from QR Menu:\n\n` +
    order.items.map(i => `${i.qty} x ${i.name} - ${i.price * i.qty}`).join("\n") +
    `\n\nTotal: ${order.total}`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${hotelNumber}?text=${encoded}`;
}
```

------------------------------------------------------------------------

# 🧰 **9. Admin Dashboard Pages**

### **AdminMenuList.tsx**

-   Table of menu items\
-   Edit button\
-   Delete button\
-   Create new button

### **AdminMenuForm.tsx**

-   Inputs:
    -   name\
    -   description\
    -   price\
    -   category\
    -   image upload\
    -   availability toggle

------------------------------------------------------------------------

# 🌐 **10. VPS Deployment Guide**

### Install Node, Git, PM2

    sudo apt update
    sudo apt install nodejs npm git -y
    sudo npm install -g pm2

### Clone project

    git clone https://github.com/you/qr-menu.git

### Start backend

    cd qr-menu/backend
    npm install
    pm2 start src/app.js --name qrmenu_api

### Build frontend

    cd ../frontend
    npm install
    npm run build

### Nginx Config

    server {
        server_name yourdomain.com;

        location / {
            root /var/www/qr-menu/frontend/dist;
            try_files $uri /index.html;
        }

        location /api {
            proxy_pass http://localhost:5000;
        }
    }

### SSL (Let's Encrypt)

    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx

------------------------------------------------------------------------

# 🔳 **11. QR Code Generator**

Use:\
https://www.qr-code-generator.com/\
or generate locally:

    npx qrcode "https://yourdomain.com" > qr.png

------------------------------------------------------------------------

# 🚀 **12. Future Upgrade Path**

### Tier 2

-   Staff dashboard\
-   Tables/Rooms\
-   Order tracking\
-   Kitchen screen

### Tier 3

-   WhatsApp Business API\
-   Payment automation\ -- Mpesa and Visa
-   Inventory integration\
-   Odoo sync (optional)

------------------------------------------------------------------------

# 🟦 **Done --- This is your full system blueprint.**

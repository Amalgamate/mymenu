# 📡 QR Menu Platform - API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### Register New Tenant
**POST** `/auth/register`

Register a new tenant (hotel/restaurant) with an admin user.

**Request Body:**
```json
{
  "businessName": "Hotel Paradise",
  "businessType": "HOTEL",
  "email": "admin@hotelparadise.com",
  "password": "SecurePassword123!",
  "whatsappNumber": "+1234567890",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "message": "Registration successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@hotelparadise.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "TENANT_ADMIN"
  },
  "tenant": {
    "id": "uuid",
    "slug": "hotel-paradise",
    "businessName": "Hotel Paradise",
    "qrCodeUrl": "/uploads/qr-codes/uuid.png"
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "admin@hotelparadise.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... },
  "tenant": { ... }
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@hotelparadise.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "TENANT_ADMIN"
  },
  "tenant": {
    "id": "uuid",
    "slug": "hotel-paradise",
    "businessName": "Hotel Paradise",
    "businessType": "HOTEL",
    "logoUrl": "/uploads/logos/logo.png",
    "qrCodeUrl": "/uploads/qr-codes/uuid.png",
    "status": "ACTIVE"
  }
}
```

### Refresh Token
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "new_access_token"
}
```

### Logout
**POST** `/auth/logout`

**Response:** `200 OK`
```json
{
  "message": "Logout successful"
}
```

---

## 🏢 Tenant Endpoints

### Get Tenant by Slug (Public)
**GET** `/tenants/slug/:slug`

Get tenant information for customer menu display.

**Example:** `/tenants/slug/hotel-paradise`

**Response:** `200 OK`
```json
{
  "tenant": {
    "id": "uuid",
    "slug": "hotel-paradise",
    "businessName": "Hotel Paradise",
    "businessType": "HOTEL",
    "logoUrl": "/uploads/logos/logo.png",
    "primaryColor": "#FF5733",
    "whatsappNumber": "+1234567890",
    "status": "ACTIVE"
  }
}
```

### Get Tenant by ID
**GET** `/tenants/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "tenant": {
    "id": "uuid",
    "slug": "hotel-paradise",
    "businessName": "Hotel Paradise",
    "_count": {
      "menuItems": 25,
      "categories": 5,
      "users": 2
    }
  }
}
```

### Update Tenant
**PUT** `/tenants/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "businessName": "Hotel Paradise Resort",
  "whatsappNumber": "+1234567890",
  "primaryColor": "#FF5733"
}
```

**Response:** `200 OK`

### Upload Logo
**POST** `/tenants/:id/logo`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `logo`: Image file (JPEG, PNG, WebP, max 5MB)

**Response:** `200 OK`
```json
{
  "message": "Logo uploaded successfully",
  "logoUrl": "/uploads/logos/1234567890-logo.png"
}
```

---

## 🍽️ Menu Endpoints

### Get Menu Items
**GET** `/menu?slug=hotel-paradise` (Public)
**GET** `/menu?tenantId=uuid` (Authenticated)
**GET** `/menu?slug=hotel-paradise&categoryId=uuid` (Filter by category)

**Response:** `200 OK`
```json
{
  "menuItems": [
    {
      "id": "uuid",
      "name": "Margherita Pizza",
      "description": "Classic Italian pizza",
      "price": 12.99,
      "imageUrl": "/uploads/menu-items/pizza.jpg",
      "isAvailable": true,
      "category": {
        "id": "uuid",
        "name": "Main Course"
      }
    }
  ]
}
```

### Create Menu Item
**POST** `/menu`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Margherita Pizza",
  "description": "Classic Italian pizza with fresh mozzarella",
  "price": 12.99,
  "categoryId": "uuid",
  "isAvailable": true,
  "sortOrder": 1
}
```

**Response:** `201 Created`

### Update Menu Item
**PUT** `/menu/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "price": 14.99,
  "isAvailable": false
}
```

**Response:** `200 OK`

### Delete Menu Item
**DELETE** `/menu/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Upload Menu Item Image
**POST** `/menu/:id/image`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `image`: Image file (JPEG, PNG, WebP, max 5MB)

**Response:** `200 OK`

---

## 📂 Category Endpoints

### Get Categories
**GET** `/categories?slug=hotel-paradise` (Public)
**GET** `/categories?tenantId=uuid` (Authenticated)

**Response:** `200 OK`
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Appetizers",
      "description": "Start your meal right",
      "sortOrder": 1,
      "_count": {
        "menuItems": 8
      }
    }
  ]
}
```

### Create Category
**POST** `/categories`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Appetizers",
  "description": "Start your meal right",
  "sortOrder": 1
}
```

**Response:** `201 Created`

### Update Category
**PUT** `/categories/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Delete Category
**DELETE** `/categories/:id`

**Headers:** `Authorization: Bearer <token>`

**Note:** Cannot delete category with menu items.

**Response:** `200 OK`

---

## 📱 QR Code Endpoints

### Generate QR Code
**POST** `/qr/generate/:tenantId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "QR code generated successfully",
  "qrCodeUrl": "/uploads/qr-codes/uuid.png",
  "menuUrl": "https://yourdomain.com/hotel-paradise"
}
```

### Get QR Code as Data URL
**GET** `/qr/data-url/:tenantId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "dataURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "menuUrl": "https://yourdomain.com/hotel-paradise"
}
```

### Download QR Code
**GET** `/qr/download/:tenantId`

**Headers:** `Authorization: Bearer <token>`

**Response:** PNG file download

---

## 🔒 Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Prices are in decimal format (e.g., 12.99)
- File uploads limited to 5MB
- Supported image formats: JPEG, PNG, WebP
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days


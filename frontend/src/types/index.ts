export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'STAFF';
  tenantId?: string;
}

export interface Tenant {
  id: string;
  slug: string;
  businessName: string;
  businessType: 'HOTEL' | 'RESTAURANT' | 'CAFE' | 'BAR' | 'RESORT' | 'OTHER';
  logoUrl?: string;
  primaryColor?: string;
  whatsappNumber: string;
  email?: string;
  status: 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  qrCodeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItem {
  id: string;
  tenantId: string;
  categoryId?: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  sortOrder: number;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}


import apiClient from './client';

export interface Tenant {
  id: string;
  slug: string;
  businessName: string;
  businessType: string;
  logoUrl?: string;
  primaryColor?: string;
  whatsappNumber: string;
  email?: string;
  status: string;
  qrCodeUrl?: string;
  currency?: string;
}

export const tenantApi = {
  // Get tenant by slug (public)
  getTenantBySlug: async (slug: string): Promise<Tenant> => {
    const response = await apiClient.get(`/tenants/slug/${slug}`);
    return response.data.tenant;
  },

  // Get tenant by ID (authenticated)
  getTenantById: async (id: string): Promise<Tenant> => {
    const response = await apiClient.get(`/tenants/${id}`);
    return response.data.tenant;
  },

  // Update tenant
  updateTenant: async (id: string, data: Partial<Tenant>) => {
    const response = await apiClient.put(`/tenants/${id}`, data);
    return response.data.tenant;
  },

  // Upload logo
  uploadLogo: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await apiClient.post(`/tenants/${id}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};


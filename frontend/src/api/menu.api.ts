import apiClient from './client';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface CreateMenuItemData {
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  isAvailable?: boolean;
  sortOrder?: number;
}

export const menuApi = {
  // Get menu items (public or authenticated)
  getMenuItems: async (params?: { slug?: string; tenantId?: string; categoryId?: string }) => {
    const response = await apiClient.get('/menu', { params });
    return response.data.menuItems;
  },

  // Get single menu item
  getMenuItem: async (id: string) => {
    const response = await apiClient.get(`/menu/${id}`);
    return response.data.menuItem;
  },

  // Create menu item
  createMenuItem: async (data: CreateMenuItemData) => {
    const response = await apiClient.post('/menu', data);
    return response.data.menuItem;
  },

  // Update menu item
  updateMenuItem: async (id: string, data: Partial<CreateMenuItemData>) => {
    const response = await apiClient.put(`/menu/${id}`, data);
    return response.data.menuItem;
  },

  // Delete menu item
  deleteMenuItem: async (id: string) => {
    await apiClient.delete(`/menu/${id}`);
  },

  // Upload menu item image
  uploadImage: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post(`/menu/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};


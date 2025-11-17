import apiClient from './client';

export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder?: number;
  isActive: boolean;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  sortOrder?: number;
}

export const categoryApi = {
  // Get all categories for current tenant
  getCategories: async (params?: { tenantId?: string; slug?: string }): Promise<Category[]> => {
    const response = await apiClient.get('/categories', { params });
    return response.data.categories;
  },

  // Create category
  createCategory: async (data: CreateCategoryData): Promise<Category> => {
    const response = await apiClient.post('/categories', data);
    return response.data.category;
  },

  // Update category
  updateCategory: async (id: string, data: Partial<CreateCategoryData & { isActive: boolean }>): Promise<Category> => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data.category;
  },

  // Delete category
  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};

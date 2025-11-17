import { Request, Response } from 'express';
import prisma from '../config/database';

/**
 * Get all categories for a tenant
 */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tenantId, slug } = req.query;

    let whereClause: any = {
      isActive: true
    };

    // If slug provided (public access), find tenant first
    if (slug) {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: slug as string }
      });

      if (!tenant) {
        res.status(404).json({ error: 'Business not found' });
        return;
      }

      whereClause.tenantId = tenant.id;
    } else if (tenantId) {
      whereClause.tenantId = tenantId as string;
    } else if (req.tenantId) {
      whereClause.tenantId = req.tenantId;
    } else {
      res.status(400).json({ error: 'Tenant identifier required' });
      return;
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            menuItems: true
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

/**
 * Create category
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, sortOrder = 0 } = req.body;
    const tenantId = req.tenantId!;

    const category = await prisma.category.create({
      data: {
        tenantId,
        name,
        description,
        sortOrder,
        isActive: true
      }
    });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

/**
 * Update category
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, sortOrder, isActive } = req.body;

    // Check if category exists and belongs to tenant
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    if (req.user?.role !== 'SUPER_ADMIN' && existingCategory.tenantId !== req.tenantId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

/**
 * Delete category
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if category exists and belongs to tenant
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            menuItems: true
          }
        }
      }
    });

    if (!existingCategory) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    if (req.user?.role !== 'SUPER_ADMIN' && existingCategory.tenantId !== req.tenantId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    if (existingCategory._count.menuItems > 0) {
      res.status(400).json({ error: 'Cannot delete category with menu items' });
      return;
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};


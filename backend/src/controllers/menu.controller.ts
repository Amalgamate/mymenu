import { Request, Response } from 'express';
import prisma from '../config/database';

/**
 * Get all menu items for a tenant (public or authenticated)
 */
export const getMenuItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tenantId, slug } = req.query;
    const { categoryId } = req.query;

    let whereClause: any = {
      isAvailable: true
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
      // Direct tenant ID (authenticated access)
      whereClause.tenantId = tenantId as string;
    } else if (req.tenantId) {
      // From tenant middleware
      whereClause.tenantId = req.tenantId;
    } else {
      res.status(400).json({ error: 'Tenant identifier required' });
      return;
    }

    // Filter by category if provided
    if (categoryId) {
      whereClause.categoryId = categoryId as string;
    }

    const menuItems = await prisma.menuItem.findMany({
      where: whereClause,
      include: {
        category: true
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    res.json({ menuItems });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ error: 'Failed to get menu items' });
  }
};

/**
 * Get single menu item
 */
export const getMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true
      }
    });

    if (!menuItem) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }

    res.json({ menuItem });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ error: 'Failed to get menu item' });
  }
};

/**
 * Create menu item
 */
export const createMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      isAvailable = true,
      sortOrder = 0
    } = req.body;

    const tenantId = req.tenantId!;

    const menuItem = await prisma.menuItem.create({
      data: {
        tenantId,
        name,
        description,
        price: parseFloat(price),
        categoryId: categoryId || null,
        isAvailable,
        sortOrder
      },
      include: {
        category: true
      }
    });

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
};

/**
 * Update menu item
 */
export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      categoryId,
      isAvailable,
      sortOrder
    } = req.body;

    // Check if item exists and belongs to tenant
    const existingItem = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!existingItem) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }

    if (req.user?.role !== 'SUPER_ADMIN' && existingItem.tenantId !== req.tenantId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(categoryId !== undefined && { categoryId }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(sortOrder !== undefined && { sortOrder })
      },
      include: {
        category: true
      }
    });

    res.json({
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

/**
 * Delete menu item
 */
export const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if item exists and belongs to tenant
    const existingItem = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!existingItem) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }

    if (req.user?.role !== 'SUPER_ADMIN' && existingItem.tenantId !== req.tenantId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.menuItem.delete({
      where: { id }
    });

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};

/**
 * Upload menu item image
 */
export const uploadMenuItemImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Check if item exists and belongs to tenant
    const existingItem = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!existingItem) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }

    if (req.user?.role !== 'SUPER_ADMIN' && existingItem.tenantId !== req.tenantId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const imageUrl = `/uploads/menu-items/${req.file.filename}`;

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: { imageUrl }
    });

    res.json({
      message: 'Image uploaded successfully',
      imageUrl,
      menuItem
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};


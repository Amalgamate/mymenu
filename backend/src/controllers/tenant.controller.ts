import { Request, Response } from 'express';
import prisma from '../config/database';

/**
 * Get tenant by ID
 */
export const getTenantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            menuItems: true,
            categories: true,
            users: true
          }
        }
      }
    });

    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }

    // Check access (super admin or own tenant)
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.tenantId !== tenant.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json({ tenant });
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ error: 'Failed to get tenant' });
  }
};

/**
 * Get tenant by slug (public endpoint for customer menu)
 */
export const getTenantBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        businessName: true,
        businessType: true,
        logoUrl: true,
        primaryColor: true,
        whatsappNumber: true,
        status: true,
        currency: true
      }
    });

    if (!tenant) {
      res.status(404).json({ error: 'Business not found' });
      return;
    }

    if (tenant.status !== 'ACTIVE' && tenant.status !== 'TRIAL') {
      res.status(403).json({ error: 'This business is currently unavailable' });
      return;
    }

    res.json({ tenant });
  } catch (error) {
    console.error('Get tenant by slug error:', error);
    res.status(500).json({ error: 'Failed to get business' });
  }
};

/**
 * Update tenant
 */
export const updateTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      businessName,
      businessType,
      whatsappNumber,
      primaryColor,
      logoUrl,
      currency
    } = req.body;

    // Check access
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.tenantId !== id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const tenant = await prisma.tenant.update({
      where: { id },
      data: {
        ...(businessName && { businessName }),
        ...(businessType && { businessType }),
        ...(whatsappNumber && { whatsappNumber }),
        ...(primaryColor && { primaryColor }),
        ...(logoUrl && { logoUrl }),
        ...(currency && { currency })
      }
    });

    res.json({
      message: 'Tenant updated successfully',
      tenant
    });
  } catch (error) {
    console.error('Update tenant error:', error);
    res.status(500).json({ error: 'Failed to update tenant' });
  }
};

/**
 * Upload tenant logo
 */
export const uploadLogo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check access
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.tenantId !== id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const logoUrl = `/uploads/logos/${req.file.filename}`;

    const tenant = await prisma.tenant.update({
      where: { id },
      data: { logoUrl }
    });

    res.json({
      message: 'Logo uploaded successfully',
      logoUrl,
      tenant
    });
  } catch (error) {
    console.error('Upload logo error:', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
};


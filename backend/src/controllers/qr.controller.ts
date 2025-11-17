import { Request, Response } from 'express';
import prisma from '../config/database';
import { generateQRCode, generateQRCodeDataURL } from '../utils/qrcode.util';
import path from 'path';
import fs from 'fs';

/**
 * Generate QR code for tenant
 */
export const generateQR = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tenantId } = req.params;

    // Check access
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.tenantId !== tenantId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }

    // Generate QR code
    const qrCodeUrl = await generateQRCode(tenant.id, tenant.slug);

    // Update tenant with QR code URL
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { qrCodeUrl }
    });

    res.json({
      message: 'QR code generated successfully',
      qrCodeUrl,
      menuUrl: `${process.env.PLATFORM_DOMAIN}/${tenant.slug}`
    });
  } catch (error) {
    console.error('Generate QR error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

/**
 * Get QR code as data URL (base64)
 */
export const getQRDataURL = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tenantId } = req.params;

    // Check access
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.tenantId !== tenantId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }

    // Generate QR code as data URL
    const dataURL = await generateQRCodeDataURL(tenant.slug);

    res.json({
      dataURL,
      menuUrl: `${process.env.PLATFORM_DOMAIN}/${tenant.slug}`
    });
  } catch (error) {
    console.error('Get QR data URL error:', error);
    res.status(500).json({ error: 'Failed to get QR code' });
  }
};

/**
 * Download QR code file
 */
export const downloadQR = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tenantId } = req.params;

    // Check access
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.tenantId !== tenantId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }

    const qrPath = path.join(__dirname, '../../uploads/qr-codes', `${tenantId}.png`);

    if (!fs.existsSync(qrPath)) {
      // Generate if doesn't exist
      await generateQRCode(tenant.id, tenant.slug);
    }

    res.download(qrPath, `${tenant.slug}-qr-code.png`);
  } catch (error) {
    console.error('Download QR error:', error);
    res.status(500).json({ error: 'Failed to download QR code' });
  }
};


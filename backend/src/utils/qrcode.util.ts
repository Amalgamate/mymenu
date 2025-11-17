import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

/**
 * Generate QR code for a tenant
 */
export const generateQRCode = async (
  tenantId: string,
  slug: string
): Promise<string> => {
  const url = `${process.env.PLATFORM_DOMAIN}/${slug}`;
  const qrDir = path.join(__dirname, '../../uploads/qr-codes');
  const qrPath = path.join(qrDir, `${tenantId}.png`);

  // Ensure directory exists
  if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
  }

  // Generate QR code
  await QRCode.toFile(qrPath, url, {
    width: 500,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M'
  });

  // Return relative URL
  return `/uploads/qr-codes/${tenantId}.png`;
};

/**
 * Generate QR code as data URL (base64)
 */
export const generateQRCodeDataURL = async (
  slug: string
): Promise<string> => {
  const url = `${process.env.PLATFORM_DOMAIN}/${slug}`;
  
  return await QRCode.toDataURL(url, {
    width: 500,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M'
  });
};

/**
 * Delete QR code file
 */
export const deleteQRCode = (tenantId: string): void => {
  const qrPath = path.join(__dirname, '../../uploads/qr-codes', `${tenantId}.png`);
  
  if (fs.existsSync(qrPath)) {
    fs.unlinkSync(qrPath);
  }
};


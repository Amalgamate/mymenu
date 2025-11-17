import { Router } from 'express';
import { generateQR, getQRDataURL, downloadQR } from '../controllers/qr.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/qr/generate/:tenantId
 * @desc    Generate QR code for tenant
 * @access  Private (Tenant Admin or Super Admin)
 */
router.post('/generate/:tenantId', authenticate, generateQR);

/**
 * @route   GET /api/qr/data-url/:tenantId
 * @desc    Get QR code as data URL (base64)
 * @access  Private (Tenant Admin or Super Admin)
 */
router.get('/data-url/:tenantId', authenticate, getQRDataURL);

/**
 * @route   GET /api/qr/download/:tenantId
 * @desc    Download QR code file
 * @access  Private (Tenant Admin or Super Admin)
 */
router.get('/download/:tenantId', authenticate, downloadQR);

export default router;


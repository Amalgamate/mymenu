import { Router } from 'express';
import { getTenantById, getTenantBySlug, updateTenant, uploadLogo as uploadLogoController } from '../controllers/tenant.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadLogo } from '../middleware/upload.middleware';

const router = Router();

/**
 * @route   GET /api/tenants/slug/:slug
 * @desc    Get tenant by slug (public)
 * @access  Public
 */
router.get('/slug/:slug', getTenantBySlug);

/**
 * @route   GET /api/tenants/:id
 * @desc    Get tenant by ID
 * @access  Private
 */
router.get('/:id', authenticate, getTenantById);

/**
 * @route   PUT /api/tenants/:id
 * @desc    Update tenant
 * @access  Private (Tenant Admin or Super Admin)
 */
router.put('/:id', authenticate, updateTenant);

/**
 * @route   POST /api/tenants/:id/logo
 * @desc    Upload tenant logo
 * @access  Private (Tenant Admin or Super Admin)
 */
router.post('/:id/logo', authenticate, uploadLogo.single('logo'), uploadLogoController);

export default router;


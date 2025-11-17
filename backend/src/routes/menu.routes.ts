import { Router } from 'express';
import {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadMenuItemImage as uploadImageController
} from '../controllers/menu.controller';
import { authenticate } from '../middleware/auth.middleware';
import { injectTenantContext } from '../middleware/tenant.middleware';
import { uploadMenuItemImage } from '../middleware/upload.middleware';

const router = Router();

/**
 * @route   GET /api/menu
 * @desc    Get all menu items (public with slug or authenticated)
 * @access  Public/Private
 */
router.get('/', getMenuItems);

/**
 * @route   GET /api/menu/:id
 * @desc    Get single menu item
 * @access  Public
 */
router.get('/:id', getMenuItem);

/**
 * @route   POST /api/menu
 * @desc    Create menu item
 * @access  Private (Tenant Admin)
 */
router.post('/', authenticate, injectTenantContext, createMenuItem);

/**
 * @route   PUT /api/menu/:id
 * @desc    Update menu item
 * @access  Private (Tenant Admin)
 */
router.put('/:id', authenticate, injectTenantContext, updateMenuItem);

/**
 * @route   DELETE /api/menu/:id
 * @desc    Delete menu item
 * @access  Private (Tenant Admin)
 */
router.delete('/:id', authenticate, injectTenantContext, deleteMenuItem);

/**
 * @route   POST /api/menu/:id/image
 * @desc    Upload menu item image
 * @access  Private (Tenant Admin)
 */
router.post(
  '/:id/image',
  authenticate,
  injectTenantContext,
  uploadMenuItemImage.single('image'),
  uploadImageController
);

export default router;


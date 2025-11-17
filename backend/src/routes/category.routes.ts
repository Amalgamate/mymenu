import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';
import { injectTenantContext } from '../middleware/tenant.middleware';

const router = Router();

/**
 * @route   GET /api/categories
 * @desc    Get all categories (public with slug or authenticated)
 * @access  Public/Private
 */
router.get('/', getCategories);

/**
 * @route   POST /api/categories
 * @desc    Create category
 * @access  Private (Tenant Admin)
 */
router.post('/', authenticate, injectTenantContext, createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Private (Tenant Admin)
 */
router.put('/:id', authenticate, injectTenantContext, updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private (Tenant Admin)
 */
router.delete('/:id', authenticate, injectTenantContext, deleteCategory);

export default router;


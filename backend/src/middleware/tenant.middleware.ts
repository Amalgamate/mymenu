import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include tenantId
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

/**
 * Middleware to inject tenant context from authenticated user
 * Must be used AFTER authenticate middleware
 */
export const injectTenantContext = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Super admin can access all tenants, so we don't inject tenantId
  if (req.user?.role === 'SUPER_ADMIN') {
    next();
    return;
  }

  // For tenant admins and staff, inject their tenantId
  if (req.user?.tenantId) {
    req.tenantId = req.user.tenantId;
  } else {
    res.status(403).json({ error: 'No tenant associated with user' });
    return;
  }

  next();
};

/**
 * Middleware to validate tenant ownership of a resource
 * Checks if the resource's tenantId matches the user's tenantId
 */
export const validateTenantOwnership = (resourceTenantId: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Super admin can access all resources
    if (req.user?.role === 'SUPER_ADMIN') {
      next();
      return;
    }

    // Check if user's tenant matches resource tenant
    if (req.tenantId !== resourceTenantId) {
      res.status(403).json({ error: 'Access denied to this resource' });
      return;
    }

    next();
  };
};


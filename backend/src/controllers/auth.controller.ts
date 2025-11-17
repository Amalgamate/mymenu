import { Request, Response } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../utils/auth.util';
import { generateUniqueSlug } from '../utils/slug.util';
import { generateQRCode } from '../utils/qrcode.util';

/**
 * Register a new tenant with admin user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      businessName,
      businessType,
      email,
      password,
      whatsappNumber,
      firstName,
      lastName
    } = req.body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(businessName);

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create tenant and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          slug,
          businessName,
          businessType,
          email,
          whatsappNumber,
          status: 'TRIAL'
        }
      });

      // Generate QR code
      const qrCodeUrl = await generateQRCode(tenant.id, slug);

      // Update tenant with QR code URL
      const updatedTenant = await tx.tenant.update({
        where: { id: tenant.id },
        data: { qrCodeUrl }
      });

      // Create admin user
      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          email,
          passwordHash,
          firstName,
          lastName,
          role: 'TENANT_ADMIN',
          isActive: true
        }
      });

      return { tenant: updatedTenant, user };
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      tenantId: result.user.tenantId
    });

    const refreshToken = generateRefreshToken({
      userId: result.user.id
    });

    res.status(201).json({
      message: 'Registration successful',
      accessToken,
      refreshToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role
      },
      tenant: {
        id: result.tenant.id,
        slug: result.tenant.slug,
        businessName: result.tenant.businessName,
        qrCodeUrl: result.tenant.qrCodeUrl
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenant: true
      }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({ error: 'Account is inactive' });
      return;
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId
    });

    const refreshToken = generateRefreshToken({
      userId: user.id
    });

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      tenant: user.tenant ? {
        id: user.tenant.id,
        slug: user.tenant.slug,
        businessName: user.tenant.businessName
      } : null
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Get current user profile
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        tenant: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      tenant: user.tenant ? {
        id: user.tenant.id,
        slug: user.tenant.slug,
        businessName: user.tenant.businessName,
        businessType: user.tenant.businessType,
        logoUrl: user.tenant.logoUrl,
        qrCodeUrl: user.tenant.qrCodeUrl,
        status: user.tenant.status
      } : null
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token required' });
      return;
    }

    // Verify refresh token
    const { verifyRefreshToken } = await import('../utils/auth.util');
    const decoded = verifyRefreshToken(refreshToken);

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId
    });

    res.json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

/**
 * Logout (client-side token removal)
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Logout successful' });
};


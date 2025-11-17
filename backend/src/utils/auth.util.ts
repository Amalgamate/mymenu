import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: {
  userId: string;
  email: string;
  role: string;
  tenantId?: string | null;
}): string => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET! as jwt.Secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } as SignOptions
  );
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload: {
  userId: string;
}): string => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET! as jwt.Secret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as SignOptions
  );
};

/**
 * Verify JWT access token
 */
export const verifyAccessToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Verify JWT refresh token
 */
export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};


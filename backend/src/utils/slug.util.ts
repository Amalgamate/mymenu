import slugify from 'slugify';
import prisma from '../config/database';

/**
 * Generate a unique slug from business name
 */
export const generateUniqueSlug = async (businessName: string): Promise<string> => {
  // Create base slug
  let slug = slugify(businessName, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });

  // Check if slug exists
  const existing = await prisma.tenant.findUnique({
    where: { slug }
  });

  // If exists, append number
  if (existing) {
    let counter = 1;
    let newSlug = `${slug}-${counter}`;
    
    while (await prisma.tenant.findUnique({ where: { slug: newSlug } })) {
      counter++;
      newSlug = `${slug}-${counter}`;
    }
    
    slug = newSlug;
  }

  return slug;
};

/**
 * Validate slug format
 */
export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};


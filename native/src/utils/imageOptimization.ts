/**
 * Image Optimization Utilities
 * Adds Cloudinary transformations to optimize images for mobile devices
 */

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'limit';
}

/**
 * Optimizes a Cloudinary image URL by adding transformation parameters
 * @param url - Original Cloudinary image URL
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function optimizeCloudinaryImage(
  url: string,
  options: ImageTransformOptions = {}
): string {
  if (!url || typeof url !== 'string') {
    return url;
  }

  // Check if it's a Cloudinary URL
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  // Default options for mobile optimization
  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    crop = 'limit',
  } = options;

  // Parse the Cloudinary URL
  // Format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{path}
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url;
  }

  // Build transformation string
  const transformations: string[] = [];

  if (width) {
    transformations.push(`w_${width}`);
  }
  if (height) {
    transformations.push(`h_${height}`);
  }
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  transformations.push(`c_${crop}`);

  const transformString = transformations.join(',');

  // Insert transformations after /upload/
  const baseUrl = url.substring(0, uploadIndex + 8); // includes '/upload/'
  const restUrl = url.substring(uploadIndex + 8);

  return `${baseUrl}${transformString}/${restUrl}`;
}

/**
 * Image size presets for different use cases
 */
export const IMAGE_PRESETS = {
  // Banner images (carousel)
  banner: {
    width: 800,
    quality: 75,
    format: 'auto' as const,
    crop: 'fill' as const,
  },

  // Thumbnail images (services, properties, etc)
  thumbnail: {
    width: 400,
    quality: 75,
    format: 'auto' as const,
    crop: 'fill' as const,
  },

  // Small thumbnails (profile pics, icons)
  smallThumbnail: {
    width: 200,
    quality: 75,
    format: 'auto' as const,
    crop: 'fill' as const,
  },

  // Icon images
  icon: {
    width: 120,
    quality: 80,
    format: 'auto' as const,
    crop: 'limit' as const,
  },

  // Full size (detail views)
  full: {
    width: 1200,
    quality: 85,
    format: 'auto' as const,
    crop: 'limit' as const,
  },
} as const;

/**
 * Optimizes an array of image URLs
 */
export function optimizeImageArray(
  images: string[],
  options: ImageTransformOptions = {}
): string[] {
  return images.map((img) => optimizeCloudinaryImage(img, options));
}

/**
 * Log image optimization statistics
 */
export function logImageOptimization(
  originalUrl: string,
  optimizedUrl: string,
  preset: string
): void {
  console.log('🎨 Image Optimized:', {
    preset,
    original: originalUrl.substring(0, 80) + '...',
    optimized: optimizedUrl.substring(0, 80) + '...',
    savings: 'Estimated 60-80% reduction',
  });
}

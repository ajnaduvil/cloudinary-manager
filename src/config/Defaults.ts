/**
 * Default configurations and presets
 */

import type { ThumbnailPreset, OptimizedVersion } from '../types'

/**
 * Default thumbnail presets
 */
export const DEFAULT_THUMBNAIL_PRESETS: Record<string, ThumbnailPreset> = {
  thumbnail: {
    name: 'thumbnail',
    width: 400,
    height: 300,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
    gravity: 'auto',
  },
  medium: {
    name: 'medium',
    width: 1200,
    height: 900,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
  },
  large: {
    name: 'large',
    width: 1920,
    height: 1080,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
  },
  small: {
    name: 'small',
    width: 200,
    height: 150,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  },
  square: {
    name: 'square',
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
    gravity: 'auto',
  },
}

/**
 * Default optimized versions
 */
export const DEFAULT_OPTIMIZED_VERSIONS: OptimizedVersion[] = [
  {
    name: 'optimized-webp',
    format: 'webp',
    quality: 'auto',
    preserveTransparency: true,
  },
  {
    name: 'optimized-avif',
    format: 'avif',
    quality: 'auto',
    preserveTransparency: true,
  },
]

/**
 * Default folder structure templates
 */
export const DEFAULT_FOLDER_TEMPLATES = {
  portfolio: {
    artworks: 'artworks/{year}/{category}',
    journals: 'journals/{year}',
    videos: 'videos/{year}',
  },
  project: {
    images: '{type}/{year}',
    videos: 'videos/{year}',
  },
}


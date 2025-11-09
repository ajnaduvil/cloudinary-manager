/**
 * Project-specific configuration types
 */

export interface OptimizedVersion {
  name: string
  format: 'webp' | 'avif' | 'jpg' | 'png'
  quality?: 'auto' | number
  preserveTransparency?: boolean
}

export interface ThumbnailSize {
  name: string
  width: number
  height: number
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'limit'
  quality?: 'auto' | number
  format?: 'auto' | 'jpg' | 'png' | 'webp'
  gravity?: 'auto' | 'face' | 'center'
}

export interface ProjectConfig {
  // Project identifier
  name: string

  // Root folder for this project (project-specific)
  rootFolder: string

  // Project-specific folder structure
  // Supports placeholders: {type}, {year}, {month}, {category}, {custom}
  structure?: {
    // Default structure template
    template?: string // e.g., "{type}/{year}/{category}"

    // Or define specific paths for asset types
    artworks?: string // e.g., "artworks/{year}/{category}"
    journals?: string
    videos?: string
    images?: string
    [key: string]: string | undefined // Custom folder types
  }

  // Project-specific versioning (overrides global)
  versioning?: {
    keepOriginal?: boolean
    generateOptimized?: boolean
    optimizedVersions?: OptimizedVersion[]
    generateThumbnails?: boolean
    thumbnailSizes?: ThumbnailSize[]
    eager?: boolean
  }

  // Project-specific defaults
  defaultTags?: string[]
  defaultContext?: Record<string, string>
}


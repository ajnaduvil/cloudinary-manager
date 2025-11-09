/**
 * Configuration types for CloudinaryManager
 */

export interface CloudinaryManagerConfig {
  // Required Cloudinary credentials
  cloudName: string
  apiKey: string
  apiSecret: string

  // Optional: Upload preset for unsigned uploads
  uploadPreset?: string

  // Global folder configuration (can be overridden per project)
  folderConfig?: {
    // Auto-create folders if they don't exist
    autoCreateFolders?: boolean
  }

  // Asset versioning configuration
  versioningConfig?: {
    // Keep original asset as-is (no transformations applied)
    keepOriginal?: boolean

    // Generate optimized versions (format conversion, compression without quality loss)
    generateOptimized?: boolean

    // Optimized version settings
    optimizedVersions?: Array<{
      name: string // e.g., "optimized-webp", "optimized-avif"
      format: 'webp' | 'avif' | 'jpg' | 'png'
      quality?: 'auto' | number // Use 'auto' for lossless optimization
      preserveTransparency?: boolean
    }>

    // Generate thumbnails
    generateThumbnails?: boolean

    // Thumbnail sizes
    thumbnailSizes?: Array<{
      name: string // e.g., "thumbnail", "medium", "large"
      width: number
      height: number
      crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'limit'
      quality?: 'auto' | number
      format?: 'auto' | 'jpg' | 'png' | 'webp'
      gravity?: 'auto' | 'face' | 'center'
    }>

    // Use eager transformations (pre-generate) or on-demand
    eager?: boolean
  }

  // Default upload options
  defaultUploadOptions?: {
    resourceType?: 'image' | 'video' | 'auto'
    overwrite?: boolean
    invalidate?: boolean
    tags?: string[]
  }
}


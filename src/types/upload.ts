/**
 * Upload-related types
 */

import type { FolderOptions } from './folder'
import type { ThumbnailSize } from './project'

export interface EagerTransformation {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'limit'
  quality?: 'auto' | number
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif'
  gravity?: 'auto' | 'face' | 'center'
  [key: string]: any // Allow additional transformation parameters
}

export interface ImageUploadOptions {
  // Folder configuration
  folder?: string | FolderOptions

  // File naming
  publicId?: string
  useTimestamp?: boolean

  // Versioning options
  keepOriginal?: boolean
  generateOptimized?: boolean
  generateThumbnails?: boolean
  thumbnailSizes?: ThumbnailSize[]

  // Metadata
  tags?: string[]
  context?: Record<string, string>

  // Transformations
  eager?: EagerTransformation[]

  // Override defaults
  overwrite?: boolean
  invalidate?: boolean
  resourceType?: 'image' | 'auto'
}

export interface VideoUploadOptions extends Omit<ImageUploadOptions, 'resourceType'> {
  // Video-specific
  generateThumbnail?: boolean
  thumbnailTime?: number // Seconds into video
  streamingProfile?: string
  videoCodec?: string
  audioCodec?: string
  resourceType?: 'video' | 'auto'
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
  stage: 'uploading' | 'processing' | 'complete'
}

export type ProgressCallback = (progress: UploadProgress) => void

export interface ImageUploadResult {
  // Original
  publicId: string
  secureUrl: string
  url: string
  width: number
  height: number
  bytes: number
  format: string

  // Optimized versions (if generated)
  optimized?: {
    [name: string]: {
      secureUrl: string
      format: string
      bytes: number
    }
  }

  // Thumbnails (if generated)
  thumbnails?: {
    [name: string]: {
      secureUrl: string
      width: number
      height: number
      bytes: number
    }
  }

  // Metadata
  folder?: string
  tags?: string[]
  context?: Record<string, string>
  createdAt: string
}

export interface VideoUploadResult extends ImageUploadResult {
  duration: number
  video?: {
    bitRate?: number
    codec?: string
    level?: number
  }
  thumbnail?: {
    secureUrl: string
    time: number
  }
}


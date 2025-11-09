/**
 * Transformation and URL generation types
 */

export interface ImageTransform {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'limit'
  quality?: 'auto' | number
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif'
  gravity?: 'auto' | 'face' | 'center'
  radius?: number
  effect?: string
  overlay?: string
  [key: string]: any // Allow additional transformation parameters
}

export interface VideoTransform extends ImageTransform {
  bitRate?: number
  duration?: number
  startOffset?: number
  endOffset?: number
  audioCodec?: string
  videoCodec?: string
  streamingProfile?: string
}

export interface ThumbnailPreset {
  name: string
  width: number
  height: number
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'limit'
  quality?: 'auto' | number
  format?: 'auto' | 'jpg' | 'png' | 'webp'
  gravity?: 'auto' | 'face' | 'center'
}

export interface ThumbnailConfig {
  // Use predefined presets
  presets?: string[] // e.g., ['thumbnail', 'medium', 'large']

  // Or custom sizes
  custom?: ThumbnailPreset[]

  // Generation strategy
  strategy: 'eager' | 'on-demand' | 'hybrid'

  // Video thumbnail
  videoThumbnail?: {
    time: number
    width: number
    height: number
  }
}


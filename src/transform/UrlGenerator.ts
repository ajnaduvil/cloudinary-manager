/**
 * URL generation for Cloudinary assets with transformations
 */

import type { ImageTransform, VideoTransform } from '../types'

export class UrlGenerator {
  private cloudName: string

  constructor(cloudName: string) {
    this.cloudName = cloudName
  }

  /**
   * Generate image URL with transformations
   */
  getImageUrl(publicId: string, transformations?: ImageTransform): string {
    const baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload`

    if (!transformations || Object.keys(transformations).length === 0) {
      return `${baseUrl}/${publicId}`
    }

    const transformParts: string[] = []

    // Size transformations
    if (transformations.width || transformations.height) {
      const sizeParts: string[] = []
      if (transformations.width) sizeParts.push(`w_${transformations.width}`)
      if (transformations.height) sizeParts.push(`h_${transformations.height}`)
      if (transformations.crop) sizeParts.push(`c_${transformations.crop}`)
      if (transformations.gravity && transformations.gravity !== 'auto') {
        sizeParts.push(`g_${transformations.gravity}`)
      }
      transformParts.push(sizeParts.join(','))
    }

    // Quality and format
    if (transformations.quality) {
      transformParts.push(`q_${transformations.quality}`)
    }
    if (transformations.format && transformations.format !== 'auto') {
      transformParts.push(`f_${transformations.format}`)
    }

    // Effects
    if (transformations.radius) transformParts.push(`r_${transformations.radius}`)
    if (transformations.effect) transformParts.push(`e_${transformations.effect}`)
    if (transformations.overlay) transformParts.push(transformations.overlay)

    // Additional transformations
    Object.entries(transformations).forEach(([key, value]) => {
      if (
        !['width', 'height', 'crop', 'quality', 'format', 'gravity', 'radius', 'effect', 'overlay'].includes(
          key
        ) &&
        value !== undefined
      ) {
        transformParts.push(`${key}_${value}`)
      }
    })

    const transformString = transformParts.join('/')
    return `${baseUrl}/${transformString}/${publicId}`
  }

  /**
   * Generate video URL with transformations
   */
  getVideoUrl(publicId: string, transformations?: VideoTransform): string {
    const baseUrl = `https://res.cloudinary.com/${this.cloudName}/video/upload`

    if (!transformations || Object.keys(transformations).length === 0) {
      return `${baseUrl}/${publicId}`
    }

    const transformParts: string[] = []

    // Size transformations
    if (transformations.width || transformations.height) {
      const sizeParts: string[] = []
      if (transformations.width) sizeParts.push(`w_${transformations.width}`)
      if (transformations.height) sizeParts.push(`h_${transformations.height}`)
      if (transformations.crop) sizeParts.push(`c_${transformations.crop}`)
      transformParts.push(sizeParts.join(','))
    }

    // Quality and format
    if (transformations.quality) {
      transformParts.push(`q_${transformations.quality}`)
    }
    if (transformations.format && transformations.format !== 'auto') {
      transformParts.push(`f_${transformations.format}`)
    }

    // Video-specific
    if (transformations.bitRate) transformParts.push(`br_${transformations.bitRate}`)
    if (transformations.duration) transformParts.push(`du_${transformations.duration}`)
    if (transformations.startOffset) transformParts.push(`so_${transformations.startOffset}`)
    if (transformations.endOffset) transformParts.push(`eo_${transformations.endOffset}`)
    if (transformations.audioCodec) transformParts.push(`ac_${transformations.audioCodec}`)
    if (transformations.videoCodec) transformParts.push(`vc_${transformations.videoCodec}`)
    if (transformations.streamingProfile) {
      transformParts.push(`sp_${transformations.streamingProfile}`)
    }

    const transformString = transformParts.join('/')
    return `${baseUrl}/${transformString}/${publicId}`
  }

  /**
   * Get thumbnail URL for video
   */
  getVideoThumbnailUrl(
    publicId: string,
    time: number = 1,
    width?: number,
    height?: number
  ): string {
    const baseUrl = `https://res.cloudinary.com/${this.cloudName}/video/upload`
    const size = width && height ? `w_${width},h_${height},so_${time}` : `so_${time}`
    return `${baseUrl}/${size}/${publicId}.jpg`
  }
}


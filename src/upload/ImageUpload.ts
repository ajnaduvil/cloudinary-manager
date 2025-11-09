/**
 * Image upload functionality
 */

import { v2 as cloudinary } from 'cloudinary'
import type {
  ImageUploadOptions,
  ImageUploadResult,
  ProgressCallback,
} from '../types'
import { UploadError } from '../utils/errors'
import { validateFileType, validateFileSize } from '../utils/validation'
import { generatePublicId } from '../utils/helpers'
import { presetToEagerTransformation } from '../transform/presets'
import { FolderManager } from '../folder/FolderManager'
import type { ConfigManager } from '../config/ConfigManager'

export class ImageUpload {
  private cloudName: string
  private uploadPreset?: string
  private folderManager: FolderManager
  private configManager?: ConfigManager

  constructor(
    cloudName: string,
    uploadPreset: string | undefined,
    folderManager: FolderManager,
    configManager?: ConfigManager
  ) {
    this.cloudName = cloudName
    this.uploadPreset = uploadPreset
    this.folderManager = folderManager
    this.configManager = configManager
  }

  /**
   * Upload single image
   */
  async uploadImage(
    file: File,
    options: ImageUploadOptions = {}
  ): Promise<ImageUploadResult> {
    // Validate file
    validateFileType(file, ['image/*'])
    validateFileSize(file, 100 * 1024 * 1024) // 100MB max

    try {
      // Build folder path
      let folderPath: string | undefined
      if (options.folder) {
        if (typeof options.folder === 'string') {
          folderPath = this.folderManager.normalizePath(options.folder)
        } else {
          // FolderOptions - will be handled by project manager
          folderPath = undefined // Will be set by project context
        }
      }

      // Generate public ID if not provided
      const publicId = options.publicId
        ? options.publicId
        : generatePublicId(file.name, folderPath, options.useTimestamp)

      // Get effective configuration
      const effectiveConfig = this.configManager?.getEffectiveConfig()
      const versioning = effectiveConfig?.versioning

      // Determine what to generate
      const keepOriginal = options.keepOriginal ?? versioning?.keepOriginal ?? true
      const generateOptimized =
        options.generateOptimized ?? versioning?.generateOptimized ?? false
      const generateThumbnails =
        options.generateThumbnails ?? versioning?.generateThumbnails ?? false
      const useEager = versioning?.eager ?? true

      // Note: keepOriginal is always true in Cloudinary - original is always stored
      // This flag is for documentation/configuration purposes

      // Build eager transformations
      const eager: any[] = []

      // Add optimized versions if requested
      if (generateOptimized && versioning?.optimizedVersions) {
        versioning.optimizedVersions.forEach((optVersion) => {
          const transformation: any = {
            format: optVersion.format,
          }
          if (optVersion.quality) {
            transformation.quality = optVersion.quality
          }
          eager.push(transformation)
        })
      }

      // Add thumbnails if requested
      if (generateThumbnails) {
        const thumbnailSizes =
          options.thumbnailSizes ?? versioning?.thumbnailSizes ?? []
        if (Array.isArray(thumbnailSizes)) {
          thumbnailSizes.forEach((size: any) => {
            eager.push(presetToEagerTransformation(size))
          })
        }
      }

      // Add custom eager transformations
      if (options.eager) {
        eager.push(...options.eager)
      }

      // Upload options
      const uploadOptions: any = {
        resource_type: options.resourceType || 'image',
        public_id: publicId,
        overwrite: options.overwrite ?? false,
        invalidate: options.invalidate ?? true,
      }

      if (folderPath) {
        uploadOptions.folder = folderPath
      }

      if (options.tags && options.tags.length > 0) {
        uploadOptions.tags = options.tags
      }

      if (options.context) {
        uploadOptions.context = options.context
      }

      // Only add eager if we have transformations and eager is enabled
      if (eager.length > 0 && useEager) {
        uploadOptions.eager = eager
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file as any, uploadOptions)

      // Transform result to our format
      return this.transformResult(result, options)
    } catch (error: any) {
      throw new UploadError(
        `Failed to upload image: ${error.message}`,
        error.http_code,
        error
      )
    }
  }

  /**
   * Upload multiple images
   */
  async uploadImages(
    files: File[],
    options: ImageUploadOptions = {}
  ): Promise<ImageUploadResult[]> {
    const results = await Promise.all(
      files.map((file) => this.uploadImage(file, options))
    )
    return results
  }

  /**
   * Upload from URL
   */
  async uploadFromUrl(
    url: string,
    options: ImageUploadOptions = {}
  ): Promise<ImageUploadResult> {
    try {
      const uploadOptions: any = {
        resource_type: options.resourceType || 'image',
        overwrite: options.overwrite ?? false,
        invalidate: options.invalidate ?? true,
      }

      if (options.folder && typeof options.folder === 'string') {
        uploadOptions.folder = this.folderManager.normalizePath(options.folder)
      }

      if (options.publicId) {
        uploadOptions.public_id = options.publicId
      }

      if (options.tags && options.tags.length > 0) {
        uploadOptions.tags = options.tags
      }

      if (options.context) {
        uploadOptions.context = options.context
      }

      const result = await cloudinary.uploader.upload(url, uploadOptions)
      return this.transformResult(result, options)
    } catch (error: any) {
      throw new UploadError(
        `Failed to upload from URL: ${error.message}`,
        error.http_code,
        error
      )
    }
  }

  /**
   * Transform Cloudinary upload result to our format
   */
  private transformResult(
    result: any,
    options: ImageUploadOptions
  ): ImageUploadResult {
    const response: ImageUploadResult = {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
      folder: result.folder,
      tags: result.tags,
      context: result.context,
      createdAt: result.created_at,
    }

    // Extract eager transformations (thumbnails and optimized versions)
    if (result.eager && Array.isArray(result.eager)) {
      const thumbnails: Record<string, any> = {}
      const optimized: Record<string, any> = {}

      result.eager.forEach((eager: any) => {
        // Determine if it's a thumbnail (has width/height) or optimized version
        if (eager.width && eager.height) {
          // This is a thumbnail - find matching size name
          const sizeName = this.findThumbnailName(eager, options.thumbnailSizes)
          if (sizeName) {
            thumbnails[sizeName] = {
              secureUrl: eager.secure_url,
              width: eager.width,
              height: eager.height,
              bytes: eager.bytes,
            }
          }
        } else {
          // This is an optimized version
          const format = eager.format || 'webp'
          optimized[`optimized-${format}`] = {
            secureUrl: eager.secure_url,
            format: format,
            bytes: eager.bytes,
          }
        }
      })

      if (Object.keys(thumbnails).length > 0) {
        response.thumbnails = thumbnails
      }
      if (Object.keys(optimized).length > 0) {
        response.optimized = optimized
      }
    }

    return response
  }

  /**
   * Find thumbnail name by matching dimensions
   */
  private findThumbnailName(
    eager: any,
    thumbnailSizes?: Array<{ name: string; width: number; height: number }>
  ): string | undefined {
    if (!thumbnailSizes) return undefined

    const match = thumbnailSizes.find(
      (size) => size.width === eager.width && size.height === eager.height
    )
    return match?.name
  }
}


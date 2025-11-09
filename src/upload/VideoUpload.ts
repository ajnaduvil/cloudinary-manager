/**
 * Video upload functionality
 */

import { v2 as cloudinary } from 'cloudinary'
import type {
  VideoUploadOptions,
  VideoUploadResult,
} from '../types'
import { UploadError } from '../utils/errors'
import { validateFileType, validateFileSize } from '../utils/validation'
import { generatePublicId } from '../utils/helpers'
import { FolderManager } from '../folder/FolderManager'
import type { ConfigManager } from '../config/ConfigManager'

export class VideoUpload {
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
   * Upload single video
   */
  async uploadVideo(
    file: File,
    options: VideoUploadOptions = {}
  ): Promise<VideoUploadResult> {
    // Validate file
    validateFileType(file, ['video/*'])
    validateFileSize(file, 500 * 1024 * 1024) // 500MB max

    try {
      // Build folder path
      let folderPath: string | undefined
      if (options.folder) {
        if (typeof options.folder === 'string') {
          folderPath = this.folderManager.normalizePath(options.folder)
        }
      }

      // Generate public ID if not provided
      const publicId = options.publicId
        ? options.publicId
        : generatePublicId(file.name, folderPath, options.useTimestamp)

      // Build eager transformations
      const eager: any[] = []

      // Add video thumbnail if requested
      if (options.generateThumbnail) {
        const time = options.thumbnailTime ?? 1
        const width = 640
        const height = 360
        eager.push({
          width,
          height,
          crop: 'fill',
          format: 'jpg',
          start_offset: time,
        })
      }

      // Upload options
      const uploadOptions: any = {
        resource_type: options.resourceType || 'video',
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

      if (options.streamingProfile) {
        uploadOptions.streaming_profile = options.streamingProfile
      }

      if (options.videoCodec) {
        uploadOptions.video_codec = options.videoCodec
      }

      if (options.audioCodec) {
        uploadOptions.audio_codec = options.audioCodec
      }

      if (eager.length > 0) {
        uploadOptions.eager = eager
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file as any, uploadOptions)

      // Transform result to our format
      return this.transformResult(result, options)
    } catch (error: any) {
      throw new UploadError(
        `Failed to upload video: ${error.message}`,
        error.http_code,
        error
      )
    }
  }

  /**
   * Upload multiple videos
   */
  async uploadVideos(
    files: File[],
    options: VideoUploadOptions = {}
  ): Promise<VideoUploadResult[]> {
    const results = await Promise.all(
      files.map((file) => this.uploadVideo(file, options))
    )
    return results
  }

  /**
   * Transform Cloudinary upload result to our format
   */
  private transformResult(
    result: any,
    options: VideoUploadOptions
  ): VideoUploadResult {
    const response: VideoUploadResult = {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
      duration: result.duration,
      folder: result.folder,
      tags: result.tags,
      context: result.context,
      createdAt: result.created_at,
    }

    if (result.video) {
      response.video = {
        bitRate: result.video.bit_rate,
        codec: result.video.codec,
        level: result.video.level,
      }
    }

    // Extract video thumbnail from eager transformations
    if (result.eager && Array.isArray(result.eager)) {
      const thumbnailEager = result.eager.find(
        (e: any) => e.format === 'jpg' && e.start_offset !== undefined
      )
      if (thumbnailEager) {
        response.thumbnail = {
          secureUrl: thumbnailEager.secure_url,
          time: thumbnailEager.start_offset || 1,
        }
      }
    }

    return response
  }
}


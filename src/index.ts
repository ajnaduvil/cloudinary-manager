/**
 * Cloudinary Manager Package
 * Main exports
 */

export { CloudinaryManager } from './CloudinaryManager'

// Type exports
export type {
  CloudinaryManagerConfig,
  ProjectConfig,
  OptimizedVersion,
  ThumbnailSize,
  FolderOptions,
  FolderPath,
  CreateFolderOptions,
  ListFoldersOptions,
  ImageUploadOptions,
  VideoUploadOptions,
  ImageUploadResult,
  VideoUploadResult,
  UploadProgress,
  ProgressCallback,
  EagerTransformation,
  SearchQuery,
  AssetResult,
  AssetMetadata,
  GetAssetOptions,
  DeleteAssetOptions,
  ImageTransform,
  VideoTransform,
  ThumbnailPreset,
  ThumbnailConfig,
} from './types'

// Re-export commonly used types from cloudinary if needed
export type { UploadApiResponse } from 'cloudinary'

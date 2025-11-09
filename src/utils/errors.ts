/**
 * Custom error classes for Cloudinary Manager
 */

export class CloudinaryManagerError extends Error {
  code: string
  statusCode?: number
  details?: any

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    details?: any
  ) {
    super(message)
    this.name = 'CloudinaryManagerError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
    Error.captureStackTrace(this, this.constructor)
  }
}

export class UploadError extends CloudinaryManagerError {
  constructor(message: string, statusCode?: number, details?: any) {
    super(message, 'UPLOAD_ERROR', statusCode, details)
    this.name = 'UploadError'
  }
}

export class FolderError extends CloudinaryManagerError {
  constructor(message: string, statusCode?: number, details?: any) {
    super(message, 'FOLDER_ERROR', statusCode, details)
    this.name = 'FolderError'
  }
}

export class AssetError extends CloudinaryManagerError {
  constructor(message: string, statusCode?: number, details?: any) {
    super(message, 'ASSET_ERROR', statusCode, details)
    this.name = 'AssetError'
  }
}

export class ValidationError extends CloudinaryManagerError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', undefined, details)
    this.name = 'ValidationError'
  }
}


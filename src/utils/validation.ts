/**
 * Input validation utilities
 */

import { ValidationError } from './errors'

/**
 * Validate file type
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): void {
  const fileType = file.type
  const isValid = allowedTypes.some((type) => {
    if (type.includes('*')) {
      const baseType = type.split('/')[0]
      return fileType.startsWith(baseType + '/')
    }
    return fileType === type
  })

  if (!isValid) {
    throw new ValidationError(
      `File type ${fileType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    )
  }
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeBytes: number): void {
  if (file.size > maxSizeBytes) {
    const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(2)
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    throw new ValidationError(
      `File size ${fileSizeMB}MB exceeds maximum size of ${maxSizeMB}MB`
    )
  }
}

/**
 * Validate folder path
 */
export function validateFolderPath(path: string): void {
  if (!path || typeof path !== 'string') {
    throw new ValidationError('Folder path must be a non-empty string')
  }

  // Check for invalid characters
  const invalidChars = /[<>:"|?*\x00-\x1f]/
  if (invalidChars.test(path)) {
    throw new ValidationError(
      'Folder path contains invalid characters. Cannot contain: < > : " | ? * or control characters'
    )
  }

  // Check for leading/trailing slashes (normalize, don't error)
  if (path.startsWith('/') || path.endsWith('/')) {
    // Will be normalized, but warn
    console.warn(
      'Folder path should not start or end with slash. It will be normalized.'
    )
  }
}

/**
 * Validate public ID
 */
export function validatePublicId(publicId: string): void {
  if (!publicId || typeof publicId !== 'string') {
    throw new ValidationError('Public ID must be a non-empty string')
  }

  // Cloudinary public IDs can contain: alphanumeric, underscore, hyphen, forward slash
  const validPattern = /^[a-zA-Z0-9_\-/]+$/
  if (!validPattern.test(publicId)) {
    throw new ValidationError(
      'Public ID can only contain alphanumeric characters, underscores, hyphens, and forward slashes'
    )
  }
}

/**
 * Normalize folder path
 */
export function normalizeFolderPath(path: string): string {
  if (!path) return ''

  // Remove leading/trailing slashes
  let normalized = path.replace(/^\/+|\/+$/g, '')

  // Replace multiple slashes with single slash
  normalized = normalized.replace(/\/+/g, '/')

  return normalized
}


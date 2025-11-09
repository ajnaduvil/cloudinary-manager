/**
 * General utility functions
 */

/**
 * Build folder path from options
 */
export function buildFolderPath(
  rootFolder: string,
  structure: string | undefined,
  options: Record<string, any>
): string {
  if (!structure) {
    return rootFolder
  }

  let path = structure

  // Replace placeholders
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const placeholder = `{${key}}`
      path = path.replace(new RegExp(placeholder, 'g'), String(value))
    }
  })

  // Remove any remaining placeholders
  path = path.replace(/\{[^}]+\}/g, '')

  // Clean up path
  path = path.replace(/\/+/g, '/').replace(/^\/|\/$/g, '')

  return rootFolder ? `${rootFolder}/${path}` : path
}

/**
 * Generate public ID from file name
 */
export function generatePublicId(
  fileName: string,
  folder?: string,
  useTimestamp?: boolean
): string {
  // Remove file extension
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')

  // Sanitize name
  const sanitized = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let publicId = sanitized

  if (useTimestamp) {
    const timestamp = Date.now()
    publicId = `${publicId}-${timestamp}`
  }

  if (folder) {
    const normalizedFolder = folder.replace(/^\/|\/$/g, '')
    return `${normalizedFolder}/${publicId}`
  }

  return publicId
}

/**
 * Format date for Cloudinary search
 */
export function formatDateForSearch(date: Date): number {
  return Math.floor(date.getTime() / 1000)
}

/**
 * Parse Cloudinary date string
 */
export function parseCloudinaryDate(dateString: string): Date {
  return new Date(dateString)
}


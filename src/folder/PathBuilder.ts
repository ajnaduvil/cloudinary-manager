/**
 * Path building utilities for folder hierarchy
 */

import type { FolderOptions, FolderPath } from '../types'
import { buildFolderPath } from '../utils/helpers'
import { validateFolderPath, normalizeFolderPath } from '../utils/validation'

export class PathBuilder {
  /**
   * Build folder path from options
   */
  static buildPath(
    rootFolder: string,
    structure: string | undefined,
    options: FolderOptions
  ): string {
    const normalizedRoot = normalizeFolderPath(rootFolder)

    if (!structure) {
      // Simple path building
      const segments: string[] = []

      if (options.type) {
        segments.push(options.type)
      }
      if (options.year) {
        segments.push(String(options.year))
      }
      if (options.month) {
        segments.push(String(options.month).padStart(2, '0'))
      }
      if (options.category) {
        segments.push(options.category)
      }

      // Add custom segments
      if (options.custom) {
        Object.values(options.custom).forEach((value) => {
          if (value) segments.push(String(value))
        })
      }

      const path = segments.join('/')
      return normalizedRoot ? `${normalizedRoot}/${path}` : path
    }

    // Use template structure
    return buildFolderPath(normalizedRoot, structure, {
      type: options.type,
      year: options.year,
      month: options.month,
      category: options.category,
      ...options.custom,
    })
  }

  /**
   * Parse folder path into segments
   */
  static parsePath(path: string): FolderPath {
    const normalized = normalizeFolderPath(path)
    const segments = normalized.split('/').filter(Boolean)

    return {
      fullPath: normalized,
      relativePath: normalized,
      segments,
    }
  }

  /**
   * Validate and normalize folder path
   */
  static normalize(path: string): string {
    validateFolderPath(path)
    return normalizeFolderPath(path)
  }

  /**
   * Join folder segments
   */
  static join(...segments: string[]): string {
    const filtered = segments.filter(Boolean)
    const joined = filtered.join('/')
    return normalizeFolderPath(joined)
  }
}


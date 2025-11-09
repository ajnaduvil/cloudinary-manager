/**
 * Folder management operations
 */

import { v2 as cloudinary } from 'cloudinary'
import type {
  FolderOptions,
  FolderPath,
  CreateFolderOptions,
  ListFoldersOptions,
} from '../types'
import { PathBuilder } from './PathBuilder'
import { FolderError } from '../utils/errors'
import { normalizeFolderPath } from '../utils/validation'

export class FolderManager {
  private cloudName: string
  private autoCreateFolders: boolean

  constructor(cloudName: string, autoCreateFolders: boolean = false) {
    this.cloudName = cloudName
    this.autoCreateFolders = autoCreateFolders
  }

  /**
   * Build folder path from options
   */
  buildPath(rootFolder: string, structure: string | undefined, options: FolderOptions): string {
    return PathBuilder.buildPath(rootFolder, structure, options)
  }

  /**
   * Parse folder path
   */
  parsePath(path: string): FolderPath {
    return PathBuilder.parsePath(path)
  }

  /**
   * Normalize folder path
   */
  normalizePath(path: string): string {
    return PathBuilder.normalize(path)
  }

  /**
   * Create folder structure (Cloudinary folders are created automatically on upload)
   * This method validates the path structure
   */
  async createFolder(path: string, options?: CreateFolderOptions): Promise<void> {
    const normalized = PathBuilder.normalize(path)

    // Cloudinary creates folders automatically when assets are uploaded
    // This method is mainly for validation and future folder management features
    if (options?.validate) {
      // Validate path structure
      const segments = normalized.split('/')
      for (const segment of segments) {
        if (!segment || segment.length === 0) {
          throw new FolderError('Invalid folder path: empty segment')
        }
      }
    }

    // In Cloudinary, folders are implicit - they exist when assets are in them
    // We can't create empty folders, but we can validate the path
  }

  /**
   * List folders (using search API to find unique folder paths)
   */
  async listFolders(root?: string, options?: ListFoldersOptions): Promise<string[]> {
    try {
      const expression = root ? `folder:${root}/*` : '*'
      const maxResults = options?.maxResults ?? 1000

      const result = await cloudinary.search
        .expression(expression)
        .max_results(maxResults)
        .execute()

      // Extract unique folder paths from results
      const folders = new Set<string>()
      if (result.resources) {
        result.resources.forEach((resource: any) => {
          if (resource.folder) {
            folders.add(resource.folder)
            // Also add parent folders
            const parts = resource.folder.split('/')
            for (let i = 1; i < parts.length; i++) {
              folders.add(parts.slice(0, i).join('/'))
            }
          }
        })
      }

      return Array.from(folders).sort()
    } catch (error: any) {
      throw new FolderError(
        `Failed to list folders: ${error.message}`,
        error.http_code,
        error
      )
    }
  }

  /**
   * Delete folder and all assets in it
   */
  async deleteFolder(path: string, options?: { invalidate?: boolean }): Promise<void> {
    try {
      const normalized = PathBuilder.normalize(path)

      // First, get all assets in the folder
      const result = await cloudinary.search
        .expression(`folder:${normalized}/*`)
        .max_results(500)
        .execute()

      if (result.resources && result.resources.length > 0) {
        // Delete all assets in the folder
        const deletePromises = result.resources.map((resource: any) =>
          cloudinary.uploader.destroy(resource.public_id, {
            resource_type: resource.resource_type,
            invalidate: options?.invalidate ?? true,
          })
        )

        await Promise.all(deletePromises)
      }

      // Note: Cloudinary doesn't have explicit folder deletion
      // Folders are removed when all assets are deleted
    } catch (error: any) {
      throw new FolderError(
        `Failed to delete folder: ${error.message}`,
        error.http_code,
        error
      )
    }
  }
}


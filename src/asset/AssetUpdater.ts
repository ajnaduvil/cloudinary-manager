/**
 * Asset update and metadata management
 */

import { v2 as cloudinary } from 'cloudinary'
import type { AssetMetadata } from '../types'
import { AssetError } from '../utils/errors'

export class AssetUpdater {
  /**
   * Update asset metadata
   */
  async updateMetadata(
    publicId: string,
    metadata: AssetMetadata,
    options: { resourceType?: 'image' | 'video' | 'raw' | 'auto' } = {}
  ): Promise<void> {
    try {
      const updates: any = {}

      if (metadata.context) {
        updates.context = metadata.context
      }

      if (metadata.tags) {
        updates.tags = metadata.tags
      }

      if (Object.keys(updates).length === 0) {
        return
      }

      await cloudinary.uploader.add_context(
        updates.context || {},
        [publicId],
        {
          resource_type: options.resourceType || 'image',
        }
      )

      if (metadata.tags) {
        // Cloudinary add_tag expects comma-separated tags as first parameter
        const tagsString = metadata.tags.join(',')
        await cloudinary.uploader.add_tag(tagsString, [publicId], {
          resource_type: options.resourceType || 'image',
        } as any)
      }
    } catch (error: any) {
      throw new AssetError(
        `Failed to update metadata: ${error.message}`,
        error.http_code,
        error
      )
    }
  }

  /**
   * Add tags to asset(s)
   */
  async addTags(
    publicIds: string | string[],
    tags: string[],
    options: { resourceType?: 'image' | 'video' | 'raw' | 'auto' } = {}
  ): Promise<void> {
    try {
      const ids = Array.isArray(publicIds) ? publicIds : [publicIds]
      // Cloudinary add_tag expects comma-separated tags as first parameter
      const tagsString = tags.join(',')
      await cloudinary.uploader.add_tag(tagsString, ids, {
        resource_type: options.resourceType || 'image',
      } as any)
    } catch (error: any) {
      throw new AssetError(
        `Failed to add tags: ${error.message}`,
        error.http_code,
        error
      )
    }
  }

  /**
   * Remove tags from asset(s)
   */
  async removeTags(
    publicIds: string | string[],
    tags: string[],
    options: { resourceType?: 'image' | 'video' | 'raw' | 'auto' } = {}
  ): Promise<void> {
    try {
      const ids = Array.isArray(publicIds) ? publicIds : [publicIds]
      // Cloudinary remove_tag expects comma-separated tags as first parameter
      const tagsString = tags.join(',')
      await cloudinary.uploader.remove_tag(tagsString, ids, {
        resource_type: options.resourceType || 'image',
      } as any)
    } catch (error: any) {
      throw new AssetError(
        `Failed to remove tags: ${error.message}`,
        error.http_code,
        error
      )
    }
  }

  /**
   * Rename/move asset
   */
  async renameAsset(
    fromPublicId: string,
    toPublicId: string,
    options: {
      resourceType?: 'image' | 'video' | 'raw' | 'auto'
      overwrite?: boolean
    } = {}
  ): Promise<void> {
    try {
      await cloudinary.uploader.rename(fromPublicId, toPublicId, {
        resource_type: options.resourceType || 'image',
        overwrite: options.overwrite ?? false,
      })
    } catch (error: any) {
      throw new AssetError(
        `Failed to rename asset: ${error.message}`,
        error.http_code,
        error
      )
    }
  }
}


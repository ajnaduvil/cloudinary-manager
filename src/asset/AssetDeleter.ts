/**
 * Asset deletion functionality
 */

import { v2 as cloudinary } from 'cloudinary'
import type { DeleteAssetOptions } from '../types'
import { AssetError } from '../utils/errors'

export class AssetDeleter {
  /**
   * Delete single asset
   */
  async deleteAsset(
    publicId: string,
    options: DeleteAssetOptions = {}
  ): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: options.resourceType || 'image',
        invalidate: options.invalidate ?? true,
      })
    } catch (error: any) {
      throw new AssetError(
        `Failed to delete asset: ${error.message}`,
        error.http_code,
        error
      )
    }
  }

  /**
   * Delete multiple assets
   */
  async deleteAssets(
    publicIds: string[],
    options: DeleteAssetOptions = {}
  ): Promise<void> {
    try {
      await Promise.all(
        publicIds.map((id) => this.deleteAsset(id, options))
      )
    } catch (error: any) {
      throw new AssetError(
        `Failed to delete assets: ${error.message}`,
        error.http_code,
        error
      )
    }
  }
}


/**
 * Asset retrieval and search functionality
 */

import { v2 as cloudinary } from 'cloudinary'
import type {
  SearchQuery,
  AssetResult,
  GetAssetOptions,
} from '../types'
import { AssetError } from '../utils/errors'
import { formatDateForSearch } from '../utils/helpers'

export class AssetRetriever {
  /**
   * Get single asset by public ID
   */
  async getAsset(
    publicId: string,
    options: GetAssetOptions = {}
  ): Promise<AssetResult> {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: options.resourceType || 'image',
      })

      return this.transformResource(result)
    } catch (error: any) {
      throw new AssetError(
        `Failed to get asset: ${error.message}`,
        error.http_code,
        error
      )
    }
  }

  /**
   * Get multiple assets by public IDs
   */
  async getAssets(
    publicIds: string[],
    options: GetAssetOptions = {}
  ): Promise<AssetResult[]> {
    const results = await Promise.all(
      publicIds.map((id) => this.getAsset(id, options))
    )
    return results
  }

  /**
   * Search assets using query
   */
  async searchAssets(query: SearchQuery): Promise<{
    resources: AssetResult[]
    totalCount: number
    nextCursor?: string
  }> {
    try {
      let expression = query.resourceType
        ? `resource_type:${query.resourceType}`
        : '*'

      // Folder-based search
      if (query.folder) {
        expression = `folder:${query.folder}/* AND ${expression}`
      } else if (query.folderPrefix) {
        expression = `folder:${query.folderPrefix}/* AND ${expression}`
      }

      // Tag-based search
      if (query.tags && query.tags.length > 0) {
        const tagExpression = query.tags.map((tag) => `tags:${tag}`).join(' AND ')
        expression = `${expression} AND ${tagExpression}`
      } else if (query.tagsAll && query.tagsAll.length > 0) {
        const tagExpression = query.tagsAll.map((tag) => `tags:${tag}`).join(' AND ')
        expression = `${expression} AND ${tagExpression}`
      } else if (query.tagsAny && query.tagsAny.length > 0) {
        const tagExpression = query.tagsAny.map((tag) => `tags:${tag}`).join(' OR ')
        expression = `${expression} AND (${tagExpression})`
      }

      // Date range
      if (query.createdAt) {
        if (query.createdAt.from) {
          const fromTimestamp = formatDateForSearch(query.createdAt.from)
          expression = `${expression} AND created_at>${fromTimestamp}`
        }
        if (query.createdAt.to) {
          const toTimestamp = formatDateForSearch(query.createdAt.to)
          expression = `${expression} AND created_at<${toTimestamp}`
        }
      }

      // Build search query
      let searchQuery = cloudinary.search.expression(expression)

      // Sorting
      if (query.sortBy && query.sortBy.length > 0) {
        query.sortBy.forEach((sort) => {
          searchQuery = searchQuery.sort_by(sort.field, sort.direction)
        })
      } else {
        // Default sort by created_at descending
        searchQuery = searchQuery.sort_by('created_at', 'desc')
      }

      // Max results
      if (query.maxResults) {
        searchQuery = searchQuery.max_results(query.maxResults)
      }

      // Next cursor for pagination
      if (query.nextCursor) {
        searchQuery = searchQuery.next_cursor(query.nextCursor)
      }

      const result = await searchQuery.execute()

      return {
        resources: (result.resources || []).map((resource: any) =>
          this.transformResource(resource)
        ),
        totalCount: result.total_count || 0,
        nextCursor: result.next_cursor,
      }
    } catch (error: any) {
      throw new AssetError(
        `Failed to search assets: ${error.message}`,
        error.http_code,
        error
      )
    }
  }

  /**
   * List assets in a folder
   */
  async listAssets(
    folder: string,
    options: {
      resourceType?: 'image' | 'video' | 'raw' | 'auto'
      maxResults?: number
    } = {}
  ): Promise<AssetResult[]> {
    const query: SearchQuery = {
      folder,
      resourceType: options.resourceType,
      maxResults: options.maxResults || 100,
    }

    const result = await this.searchAssets(query)
    return result.resources
  }

  /**
   * Transform Cloudinary resource to our format
   */
  private transformResource(resource: any): AssetResult {
    return {
      publicId: resource.public_id,
      secureUrl: resource.secure_url,
      url: resource.url,
      resourceType: resource.resource_type,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      bytes: resource.bytes,
      folder: resource.folder,
      tags: resource.tags,
      context: resource.context,
      createdAt: resource.created_at,
      version: resource.version,
    }
  }
}


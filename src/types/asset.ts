/**
 * Asset management types
 */

export interface SearchQuery {
  // Folder-based
  folder?: string
  folderPrefix?: string

  // Tags
  tags?: string[]
  tagsAll?: string[]
  tagsAny?: string[]

  // Resource type
  resourceType?: 'image' | 'video' | 'raw' | 'auto'

  // Metadata
  context?: Record<string, string>

  // Date range
  createdAt?: {
    from?: Date
    to?: Date
  }

  // Pagination
  maxResults?: number
  nextCursor?: string

  // Sorting
  sortBy?: Array<{
    field: 'created_at' | 'public_id' | 'bytes' | 'width' | 'height'
    direction: 'asc' | 'desc'
  }>
}

export interface AssetResult {
  publicId: string
  secureUrl: string
  url: string
  resourceType: 'image' | 'video' | 'raw'
  format: string
  width?: number
  height?: number
  bytes: number
  folder?: string
  tags?: string[]
  context?: Record<string, string>
  createdAt: string
  version: number
}

export interface AssetMetadata {
  context?: Record<string, string>
  tags?: string[]
}

export interface GetAssetOptions {
  resourceType?: 'image' | 'video' | 'raw' | 'auto'
  includeMetadata?: boolean
}

export interface DeleteAssetOptions {
  resourceType?: 'image' | 'video' | 'raw' | 'auto'
  invalidate?: boolean
}


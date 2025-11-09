/**
 * Folder hierarchy and path management types
 */

export interface FolderOptions {
  project?: string
  type?: 'artworks' | 'journals' | 'videos' | 'images' | string
  year?: number
  month?: number
  category?: string
  custom?: Record<string, string>
}

export interface FolderPath {
  fullPath: string
  relativePath: string
  segments: string[]
}

export interface CreateFolderOptions {
  recursive?: boolean
  validate?: boolean
}

export interface ListFoldersOptions {
  maxResults?: number
  prefix?: string
}


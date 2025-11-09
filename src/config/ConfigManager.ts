/**
 * Configuration management utilities
 */

import type { CloudinaryManagerConfig, ProjectConfig } from '../types'
import { DEFAULT_THUMBNAIL_PRESETS, DEFAULT_OPTIMIZED_VERSIONS } from './Defaults'

export class ConfigManager {
  private globalConfig: CloudinaryManagerConfig
  private currentProject: ProjectConfig | null = null

  constructor(config: CloudinaryManagerConfig) {
    this.globalConfig = config
    this.validateConfig(config)
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: CloudinaryManagerConfig): void {
    if (!config.cloudName) {
      throw new Error('cloudName is required')
    }
    if (!config.apiKey) {
      throw new Error('apiKey is required')
    }
    if (!config.apiSecret) {
      throw new Error('apiSecret is required')
    }
  }

  /**
   * Set current project configuration
   */
  setProject(project: ProjectConfig): void {
    this.currentProject = project
  }

  /**
   * Get current project configuration
   */
  getProject(): ProjectConfig | null {
    return this.currentProject
  }

  /**
   * Get effective configuration (global + project overrides)
   */
  getEffectiveConfig(): {
    versioning: {
      keepOriginal: boolean
      generateOptimized: boolean
      optimizedVersions: typeof DEFAULT_OPTIMIZED_VERSIONS
      generateThumbnails: boolean
      thumbnailSizes: typeof DEFAULT_THUMBNAIL_PRESETS
      eager: boolean
    }
    folder: {
      autoCreateFolders: boolean
    }
  } {
    const global = this.globalConfig
    const project = this.currentProject

    return {
      versioning: {
        keepOriginal:
          project?.versioning?.keepOriginal ??
          global.versioningConfig?.keepOriginal ??
          true,
        generateOptimized:
          project?.versioning?.generateOptimized ??
          global.versioningConfig?.generateOptimized ??
          false,
        optimizedVersions:
          project?.versioning?.optimizedVersions ??
          global.versioningConfig?.optimizedVersions ??
          DEFAULT_OPTIMIZED_VERSIONS,
        generateThumbnails:
          project?.versioning?.generateThumbnails ??
          global.versioningConfig?.generateThumbnails ??
          false,
        thumbnailSizes:
          project?.versioning?.thumbnailSizes ??
          global.versioningConfig?.thumbnailSizes ??
          (Object.values(DEFAULT_THUMBNAIL_PRESETS) as any),
        eager:
          project?.versioning?.eager ??
          global.versioningConfig?.eager ??
          true,
      },
      folder: {
        autoCreateFolders:
          global.folderConfig?.autoCreateFolders ?? false,
      },
    }
  }

  /**
   * Get global configuration
   */
  getGlobalConfig(): CloudinaryManagerConfig {
    return this.globalConfig
  }
}


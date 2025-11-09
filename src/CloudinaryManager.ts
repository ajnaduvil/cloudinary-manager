/**
 * Main CloudinaryManager class
 * Provides a unified interface for Cloudinary operations
 */

import { v2 as cloudinary } from 'cloudinary'
import type { CloudinaryManagerConfig, ProjectConfig } from './types'
import { ConfigManager } from './config/ConfigManager'
import { FolderManager } from './folder/FolderManager'
import { ImageUpload } from './upload/ImageUpload'
import { VideoUpload } from './upload/VideoUpload'
import { AssetRetriever } from './asset/AssetRetriever'
import { AssetUpdater } from './asset/AssetUpdater'
import { AssetDeleter } from './asset/AssetDeleter'
import { UrlGenerator } from './transform/UrlGenerator'
import { ProjectManager } from './project/ProjectManager'

/**
 * Upload Module Interface
 */
class UploadModule {
  constructor(
    private imageUpload: ImageUpload,
    private videoUpload: VideoUpload
  ) {}

  get image() {
    return this.imageUpload
  }

  get video() {
    return this.videoUpload
  }
}

/**
 * Asset Module Interface
 */
class AssetModule {
  constructor(
    private retriever: AssetRetriever,
    private updater: AssetUpdater,
    private deleter: AssetDeleter
  ) {}

  get search() {
    return this.retriever
  }

  get update() {
    return this.updater
  }

  get delete() {
    return this.deleter
  }
}

/**
 * Transform Module Interface
 */
class TransformModule {
  constructor(private urlGenerator: UrlGenerator) {}

  get url() {
    return this.urlGenerator
  }
}

/**
 * CloudinaryManager - Main class for managing Cloudinary assets
 */
export class CloudinaryManager {
  private configManager: ConfigManager
  private folderManager: FolderManager
  private projectManager: ProjectManager
  private imageUpload: ImageUpload
  private videoUpload: VideoUpload
  private assetRetriever: AssetRetriever
  private assetUpdater: AssetUpdater
  private assetDeleter: AssetDeleter
  private urlGenerator: UrlGenerator

  // Module accessors
  public readonly upload: UploadModule
  public readonly asset: AssetModule
  public readonly transform: TransformModule
  public readonly folder: FolderManager
  public readonly project: ProjectManager

  constructor(config: CloudinaryManagerConfig) {
    // Initialize Cloudinary SDK
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true,
    })

    // Initialize configuration manager
    this.configManager = new ConfigManager(config)

    // Initialize folder manager
    this.folderManager = new FolderManager(
      config.cloudName,
      config.folderConfig?.autoCreateFolders ?? false
    )

    // Initialize project manager
    this.projectManager = new ProjectManager(this.folderManager)

    // Initialize upload modules
    this.imageUpload = new ImageUpload(
      config.cloudName,
      config.uploadPreset,
      this.folderManager,
      this.configManager
    )
    this.videoUpload = new VideoUpload(
      config.cloudName,
      config.uploadPreset,
      this.folderManager,
      this.configManager
    )

    // Initialize asset modules
    this.assetRetriever = new AssetRetriever()
    this.assetUpdater = new AssetUpdater()
    this.assetDeleter = new AssetDeleter()

    // Initialize transform module
    this.urlGenerator = new UrlGenerator(config.cloudName)

    // Expose modules
    this.upload = new UploadModule(this.imageUpload, this.videoUpload)
    this.asset = new AssetModule(
      this.assetRetriever,
      this.assetUpdater,
      this.assetDeleter
    )
    this.transform = new TransformModule(this.urlGenerator)
    this.folder = this.folderManager
    this.project = this.projectManager
  }

  /**
   * Set current project configuration
   */
  setProject(project: ProjectConfig): void {
    this.projectManager.setProject(project)
    this.configManager.setProject(project)
  }

  /**
   * Get current project
   */
  getProject(): ProjectConfig | null {
    return this.projectManager.getProject()
  }

  /**
   * Get effective configuration (global + project overrides)
   */
  getConfig() {
    return this.configManager.getEffectiveConfig()
  }
}


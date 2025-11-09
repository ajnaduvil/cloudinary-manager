/**
 * Project-specific organization and management
 */

import type { ProjectConfig, FolderOptions, ImageUploadOptions } from '../types'
import { FolderManager } from '../folder/FolderManager'
import { buildFolderPath } from '../utils/helpers'

export class ProjectManager {
  private currentProject: ProjectConfig | null = null
  private folderManager: FolderManager

  constructor(folderManager: FolderManager) {
    this.folderManager = folderManager
  }

  /**
   * Set current project configuration
   */
  setProject(project: ProjectConfig): void {
    this.currentProject = project
  }

  /**
   * Get current project
   */
  getProject(): ProjectConfig | null {
    return this.currentProject
  }

  /**
   * Get folder path for project asset type
   */
  getProjectPath(type: string, ...segments: string[]): string {
    if (!this.currentProject) {
      throw new Error('No project set. Call setProject() first.')
    }

    const { rootFolder, structure } = this.currentProject

    // Get structure template for this type
    let template: string | undefined
    if (structure) {
      template = structure[type] || structure.template
    }

    // Build options from segments
    const options: FolderOptions = {
      type,
    }

    // Map segments to options (year, month, category, etc.)
    if (segments.length > 0) {
      options.year = parseInt(segments[0]) || undefined
    }
    if (segments.length > 1) {
      options.month = parseInt(segments[1]) || undefined
    }
    if (segments.length > 2) {
      options.category = segments[2]
    }
    if (segments.length > 3) {
      options.custom = {}
      for (let i = 3; i < segments.length; i++) {
        options.custom[`segment${i}`] = segments[i]
      }
    }

    return this.folderManager.buildPath(rootFolder, template, options)
  }

  /**
   * Build folder options from project context
   */
  buildFolderFromContext(
    type: string,
    options: {
      year?: number
      month?: number
      category?: string
      custom?: Record<string, string>
    } = {}
  ): FolderOptions {
    return {
      type,
      ...options,
    }
  }

  /**
   * Get project root folder
   */
  getRootFolder(): string {
    if (!this.currentProject) {
      throw new Error('No project set. Call setProject() first.')
    }
    return this.currentProject.rootFolder
  }

  /**
   * Get project structure template for asset type
   */
  getStructureTemplate(type: string): string | undefined {
    if (!this.currentProject?.structure) {
      return undefined
    }
    return this.currentProject.structure[type] || this.currentProject.structure.template
  }
}


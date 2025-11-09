/**
 * Predefined thumbnail presets
 */

import type { ThumbnailPreset } from '../types'
import { DEFAULT_THUMBNAIL_PRESETS } from '../config/Defaults'

/**
 * Get thumbnail preset by name
 */
export function getThumbnailPreset(name: string): ThumbnailPreset | undefined {
  return DEFAULT_THUMBNAIL_PRESETS[name]
}

/**
 * Get all available thumbnail presets
 */
export function getAllThumbnailPresets(): Record<string, ThumbnailPreset> {
  return { ...DEFAULT_THUMBNAIL_PRESETS }
}

/**
 * Create eager transformation from thumbnail preset
 */
export function presetToEagerTransformation(
  preset: ThumbnailPreset
): Record<string, any> {
  const transformation: Record<string, any> = {}

  if (preset.width) transformation.width = preset.width
  if (preset.height) transformation.height = preset.height
  if (preset.crop) transformation.crop = preset.crop
  if (preset.quality) transformation.quality = preset.quality
  if (preset.format) transformation.format = preset.format
  if (preset.gravity) transformation.gravity = preset.gravity

  return transformation
}


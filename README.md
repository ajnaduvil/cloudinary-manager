# @artistbabuvarghese/cloudinary-manager

Cloudinary manager wrapper for upload, folder management, and asset organization.

## Installation

```bash
yarn add @artistbabuvarghese/cloudinary-manager
```

## Features

- **Flexible Asset Organization**: Project-based folder hierarchy with configurable structure
- **Image & Video Upload**: Support for both images and videos with progress tracking
- **Automatic Versioning**: Keep original, generate optimized versions, and create thumbnails
- **Folder Management**: Create, list, and manage folder structures
- **Asset Search**: Powerful search capabilities with filtering and sorting
- **Metadata Management**: Add, update, and manage tags and context metadata
- **URL Generation**: Generate optimized URLs with transformations

## Basic Usage

### Initialization

```typescript
import { CloudinaryManager } from '@artistbabuvarghese/cloudinary-manager'

const manager = new CloudinaryManager({
  cloudName: 'your-cloud-name',
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
  versioningConfig: {
    keepOriginal: true,
    generateOptimized: true,
    optimizedVersions: [
      { name: 'optimized-webp', format: 'webp', quality: 'auto' },
      { name: 'optimized-avif', format: 'avif', quality: 'auto' },
    ],
    generateThumbnails: true,
    thumbnailSizes: [
      { name: 'thumbnail', width: 400, height: 300, crop: 'fill' },
      { name: 'medium', width: 1200, height: 900, crop: 'limit' },
    ],
    eager: true, // Pre-generate transformations
  },
})
```

### Project Configuration

```typescript
// Set up a project with its own root folder and structure
manager.setProject({
  name: 'portfolio',
  rootFolder: 'portfolio',
  structure: {
    artworks: 'artworks/{year}/{category}',
    journals: 'journals/{year}',
    videos: 'videos/{year}',
  },
  versioning: {
    keepOriginal: true,
    generateOptimized: true,
    generateThumbnails: true,
    eager: true,
  },
})
```

### Upload Image

```typescript
// Upload with automatic thumbnails and optimized versions
const result = await manager.upload.image.uploadImage(file, {
  folder: {
    type: 'artworks',
    year: 2024,
    category: 'oil-paintings',
  },
  tags: ['artwork', 'oil-painting'],
  context: {
    title: 'Sunset Over Mountains',
    artist: 'Babu Varghese',
  },
})

// Access results
console.log(result.secureUrl) // Original
console.log(result.thumbnails?.thumbnail.secureUrl) // Thumbnail
console.log(result.optimized?.['optimized-webp'].secureUrl) // Optimized WebP
```

### Upload Video

```typescript
const result = await manager.upload.video.uploadVideo(file, {
  folder: 'videos/2024',
  generateThumbnail: true,
  thumbnailTime: 1, // Seconds into video
})
```

### Search Assets

```typescript
const results = await manager.asset.search.searchAssets({
  folder: 'portfolio/artworks',
  tags: ['artwork'],
  resourceType: 'image',
  sortBy: [{ field: 'created_at', direction: 'desc' }],
  maxResults: 50,
})

console.log(results.resources) // Array of assets
console.log(results.totalCount) // Total matching assets
```

### Generate URLs

```typescript
// Generate optimized image URL
const url = manager.transform.url.getImageUrl('artworks/sunset', {
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 'auto',
  format: 'webp',
})
```

## Advanced Features

### Folder Management

```typescript
// List folders
const folders = await manager.folder.listFolders('portfolio')

// Delete folder and all assets
await manager.folder.deleteFolder('portfolio/artworks/2023')
```

### Asset Management

```typescript
// Update metadata
await manager.asset.update.updateMetadata('artworks/sunset', {
  context: { title: 'New Title' },
  tags: ['artwork', 'landscape'],
})

// Add tags
await manager.asset.update.addTags('artworks/sunset', ['featured'])

// Delete asset
await manager.asset.delete.deleteAsset('artworks/sunset')
```

## Configuration Options

### Versioning Configuration

- `keepOriginal`: Keep the original asset as-is (always true in Cloudinary)
- `generateOptimized`: Create optimized versions (WebP, AVIF, etc.)
- `optimizedVersions`: Array of optimized version configurations
- `generateThumbnails`: Automatically generate thumbnails
- `thumbnailSizes`: Array of thumbnail size configurations
- `eager`: Use eager transformations (pre-generate) or on-demand

### Project Structure

Projects can define their own:
- Root folder
- Folder structure templates with placeholders
- Project-specific versioning settings
- Default tags and context

## License

MIT

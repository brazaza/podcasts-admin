import type { CollectionConfig } from 'payload'

// Folder options for S3 organization
export const MEDIA_FOLDERS = ['artists', 'podcasts', 'audio'] as const
export type MediaFolder = (typeof MEDIA_FOLDERS)[number]

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'alt_text',
    defaultColumns: ['filename', 'folder', 'mimeType', 'updatedAt'],
    group: 'Media',
    listSearchableFields: ['alt_text', 'folder', 'filename'],
  },
  upload: {
    mimeTypes: ['image/*', 'audio/*'],
    staticDir: undefined,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 800,
        position: 'centre',
      },
      {
        name: 'banner',
        width: 1600,
        height: 400,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt_text',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Descriptive alt text for accessibility',
      },
    },
    {
      name: 'folder',
      type: 'select',
      required: true,
      defaultValue: 'podcasts',
      options: MEDIA_FOLDERS.map((f) => ({ label: f.charAt(0).toUpperCase() + f.slice(1), value: f })),
      admin: {
        position: 'sidebar',
        description: 'S3 folder for organization',
      },
    },
    {
      name: 'original_url',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Original uploaded file URL',
      },
    },
    {
      name: 'webp_url',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'WebP converted image URL (auto-generated)',
      },
    },
    {
      name: 'blurhash',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Blurhash placeholder (auto-generated)',
      },
    },
  ],
  hooks: {
    // WebP conversion and blurhash generation handled in separate hook file
    // See: src/hooks/media-processing.ts
  },
}

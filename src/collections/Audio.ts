import type { CollectionConfig } from 'payload'
import { audioProcessingHook } from '../hooks/media-processing'

export const Audio: CollectionConfig = {
  slug: 'audio',
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['filename', 'title', 'duration_seconds', 'mimeType', 'updatedAt'],
    group: 'Media',
    listSearchableFields: ['title', 'filename'],
  },
  upload: {
    mimeTypes: ['audio/*'],
    staticDir: undefined,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        placeholder: 'Audio file title (optional)',
      },
    },
    {
      name: 'duration_seconds',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Duration in seconds (requires ffprobe on server)',
      },
    },
  ],
  hooks: {
    afterChange: [audioProcessingHook],
  },
}

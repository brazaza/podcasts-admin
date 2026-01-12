import path from 'path'
import type { CollectionConfig } from 'payload'

const sanitizeFilename = (input: string): string => {
  const { name, ext } = path.parse(input)
  const safeName = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

  const safeExt = ext.replace(/[^a-zA-Z0-9.]/g, '')
  return `${safeName || 'file'}${safeExt || ''}`
}

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
    defaultColumns: ['filename', 'title', 'mimeType', 'updatedAt'],
    group: 'Media',
    listSearchableFields: ['title', 'filename'],
  },
  upload: {
    mimeTypes: ['audio/*'],
    staticDir: undefined,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.filename) {
          data.filename = sanitizeFilename(data.filename)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        placeholder: 'Audio file title (optional)',
      },
    },
  ],
}

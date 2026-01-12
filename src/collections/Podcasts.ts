import type { CollectionConfig } from 'payload'

// TODO: Implement RBAC - currently using basic authenticated access
// Future roles: admin, editor, author

export const Podcasts: CollectionConfig = {
  slug: 'podcasts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['number', 'title', 'slug', 'release_date', 'updatedAt'],
    group: 'Content',
    livePreview: {
      url: ({ data }) =>
        `${process.env.PREVIEW_URL || 'http://localhost:3000'}/podcast/${data.slug}`,
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1000,
      },
    },
  },
  fields: [
    {
      name: 'number',
      type: 'number',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Podcast episode number',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Podcast title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.number) {
              return String(data.number).padStart(3, '0')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        placeholder: 'Podcast description',
      },
    },
    {
      name: 'release_date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'artists',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
      admin: {
        description: 'Featured artists (supports multiple for b2b)',
      },
    },
    {
      name: 'audio_url',
      type: 'text',
      admin: {
        description: 'Direct audio file URL (or upload via media)',
      },
    },
    {
      name: 'audio',
      type: 'upload',
      relationTo: 'audio',
      admin: {
        description: 'Upload audio file',
      },
    },
    {
      name: 'duration_seconds',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Auto-calculated from audio file via ffprobe',
        readOnly: true,
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'images',
      admin: {
        description: 'Podcast cover image',
      },
    },
    {
      name: 'mirrors',
      type: 'group',
      label: 'External Links',
      fields: [
        {
          name: 'vk',
          label: 'VK URL',
          type: 'text',
        },
        {
          name: 'soundcloud',
          label: 'SoundCloud URL',
          type: 'text',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        description: 'SEO metadata',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            placeholder: 'SEO title (defaults to podcast title)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            placeholder: 'SEO description',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'images',
          admin: {
            description: 'Open Graph image',
          },
        },
      ],
    },
  ],
  timestamps: true,
}

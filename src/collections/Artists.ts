import type { CollectionConfig } from 'payload'

// TODO: Implement RBAC - currently using basic authenticated access
// Future roles: admin, editor, author

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'is_resident', 'updatedAt'],
    group: 'Content',
    livePreview: {
      url: ({ data }) =>
        `${process.env.PREVIEW_URL || 'http://localhost:3000'}/artist/${data.slug}`,
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
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Artist name',
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
        description: 'URL-friendly identifier (auto-generated from name if empty)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'is_resident',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mark as resident artist',
      },
    },
    {
      name: 'bio',
      type: 'richText',
      admin: {
        description: 'Artist biography (supports markdown shortcuts)',
      },
    },
    {
      name: 'banner_image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Wide banner image for artist page header',
      },
    },
    {
      name: 'square_image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Square image for cards and mobile views',
      },
    },
    {
      name: 'socials',
      type: 'json',
      admin: {
        description: 'Social media links (JSON object)',
      },
      defaultValue: {},
    },
    {
      name: 'extra_sections',
      type: 'json',
      admin: {
        description: 'Additional content sections for extensibility (JSON/blocks)',
      },
      defaultValue: [],
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
            placeholder: 'SEO title (defaults to artist name)',
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
          relationTo: 'media',
          admin: {
            description: 'Open Graph image',
          },
        },
      ],
    },
  ],
  timestamps: true,
}

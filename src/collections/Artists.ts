import type { CollectionConfig } from 'payload'

// TODO: Implement RBAC - currently using basic authenticated access
// Future roles: admin, editor, author

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'slug',
      'is_resident',
      'yandex_music',
      'spotify',
      'bandlink',
      'bandcamp',
      'telegram',
      'instagram',
      'tiktok',
      'vk',
      'updatedAt',
    ],
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
      relationTo: 'images',
      admin: {
        description: 'Wide banner image for artist page header',
      },
    },
    {
      name: 'square_image',
      type: 'upload',
      relationTo: 'images',
      admin: {
        description: 'Square image for cards and mobile views',
      },
    },
    // Social media links - each as a separate column
    {
      type: 'collapsible',
      label: 'Social Media Links',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'yandex_music',
          label: 'Yandex Music',
          type: 'text',
          admin: {
            placeholder: 'https://music.yandex.ru/artist/...',
          },
        },
        {
          name: 'spotify',
          label: 'Spotify',
          type: 'text',
          admin: {
            placeholder: 'https://open.spotify.com/artist/...',
          },
        },
        {
          name: 'bandlink',
          label: 'Bandlink',
          type: 'text',
          admin: {
            placeholder: 'https://band.link/...',
          },
        },
        {
          name: 'bandcamp',
          label: 'Bandcamp',
          type: 'text',
          admin: {
            placeholder: 'https://....bandcamp.com',
          },
        },
        {
          name: 'telegram',
          label: 'Telegram',
          type: 'text',
          admin: {
            placeholder: 'https://t.me/...',
          },
        },
        {
          name: 'instagram',
          label: 'Instagram',
          type: 'text',
          admin: {
            placeholder: 'https://instagram.com/...',
          },
        },
        {
          name: 'tiktok',
          label: 'TikTok',
          type: 'text',
          admin: {
            placeholder: 'https://tiktok.com/@...',
          },
        },
        {
          name: 'vk',
          label: 'VK',
          type: 'text',
          admin: {
            placeholder: 'https://vk.com/...',
          },
        },
        {
          name: 'extra_links',
          label: 'Extra Links',
          type: 'array',
          admin: {
            description: 'Additional links displayed with a generic link icon',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Link label',
              },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'https://...',
              },
            },
          ],
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

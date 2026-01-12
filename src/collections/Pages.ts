import type { CollectionConfig, Block } from 'payload'

// TODO: Implement RBAC - currently using basic authenticated access
// Future roles: admin, editor, author

// Extensible block definitions for page layouts
const HeroBlock: Block = {
  slug: 'hero',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

const ContentBlock: Block = {
  slug: 'content',
  fields: [
    {
      name: 'content',
      type: 'richText',
    },
  ],
}

const FeaturedArtistsBlock: Block = {
  slug: 'featured-artists',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Featured Artists',
    },
    {
      name: 'artists',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
    },
    {
      name: 'showResidentsOnly',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

const FeaturedPodcastsBlock: Block = {
  slug: 'featured-podcasts',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Latest Podcasts',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
    },
    {
      name: 'podcasts',
      type: 'relationship',
      relationTo: 'podcasts',
      hasMany: true,
      admin: {
        description: 'Manually select podcasts (leave empty for latest)',
      },
    },
  ],
}

const CustomSectionBlock: Block = {
  slug: 'custom-section',
  fields: [
    {
      name: 'data',
      type: 'json',
      admin: {
        description: 'Custom JSON data for extensible sections',
      },
    },
    {
      name: 'component',
      type: 'text',
      admin: {
        description: 'Component name to render this section',
      },
    },
  ],
}

// All available blocks for page layouts
export const PAGE_BLOCKS: Block[] = [
  HeroBlock,
  ContentBlock,
  FeaturedArtistsBlock,
  FeaturedPodcastsBlock,
  CustomSectionBlock,
]

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
    livePreview: {
      url: ({ data }) =>
        `${process.env.PREVIEW_URL || 'http://localhost:3000'}/${data.slug === 'home' ? '' : data.slug}`,
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
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Page title',
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
        description: 'URL path (e.g., "about" for /about)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
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
      name: 'layout',
      type: 'blocks',
      blocks: PAGE_BLOCKS,
      admin: {
        description: 'Build page layout using blocks',
      },
    },
    {
      name: 'extra_sections',
      type: 'json',
      admin: {
        description: 'Additional custom sections (JSON) for extensibility',
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
            placeholder: 'SEO title (defaults to page title)',
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

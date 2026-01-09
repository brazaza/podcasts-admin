import type { CollectionConfig, CollectionSlug } from 'payload'

export const Podcasts: CollectionConfig = {
  slug: 'podcasts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'author', 'status', 'publishedAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Новый подкаст/микстейп',
      admin: {
        placeholder: 'Введите название выпуска',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        placeholder: 'Опционально, если не заполнить — можно сгенерировать отдельно',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'podcast',
      options: [
        { label: 'Podcast', value: 'podcast' },
        { label: 'Mixtape', value: 'mixtape' },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors' as CollectionSlug,
      required: false,
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media' as CollectionSlug,
      required: false,
    },
    {
      name: 'audio',
      label: 'Audio / Track',
      type: 'upload',
      relationTo: 'media' as CollectionSlug,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        placeholder: 'Короткое описание',
      },
    },
    {
      name: 'body',
      label: 'Текст (rich)',
      type: 'richText',
      admin: {
        description: 'Полный текст выпуска',
      },
    },
    {
      name: 'tags',
      type: 'array',
      labels: {
        singular: 'tag',
        plural: 'tags',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'mirrors',
      type: 'group',
      label: 'Зеркала',
      fields: [
        {
          name: 'vk',
          label: 'VK Podcast URL',
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
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

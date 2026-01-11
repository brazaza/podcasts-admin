import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'socials.vk', 'socials.soundcloud'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'birthday',
      type: 'date',
      required: false,
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'socials',
      type: 'group',
      admin: {
        description: 'Контакты и соцсети (опционально)',
      },
      fields: [
        {
          name: 'vk',
          type: 'text',
        },
        {
          name: 'soundcloud',
          type: 'text',
        },
        {
          name: 'instagram',
          type: 'text',
        },
        {
          name: 'website',
          type: 'text',
        },
      ],
    },
  ],
}

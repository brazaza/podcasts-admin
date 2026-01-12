import type { CollectionConfig } from 'payload'

export const Images: CollectionConfig = {
  slug: 'images',
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
    group: 'Media',
    listSearchableFields: ['alt', 'filename'],
  },
  upload: {
    mimeTypes: ['image/*'],
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
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Descriptive alt text for accessibility',
      },
    },
    {
      name: 'blurHash',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'BlurHash placeholder (auto-generated)',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation, context }) => {
        if (context?.skipBlurHashGeneration) return doc
        if (operation !== 'create' && !context?.fileChanged) return doc

        const mimeType = doc.mimeType || ''
        if (!mimeType.startsWith('image/')) return doc
        if (doc.blurHash && !context?.fileChanged) return doc

        try {
          const { generateBlurHash } = await import('../hooks/blurhash-generator')
          const blurHash = await generateBlurHash(doc, req)

          if (blurHash && blurHash !== doc.blurHash) {
            await req.payload.update({
              collection: 'images',
              id: doc.id,
              data: { blurHash },
              req,
              context: { skipBlurHashGeneration: true },
            })
          }
        } catch (error) {
          console.error(`[BlurHash] Error generating for ${doc.filename}:`, error)
        }

        return doc
      },
    ],
  },
}

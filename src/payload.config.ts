import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  HeadingFeature,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
  BlockquoteFeature,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Artists } from './collections/Artists'
import { Audio } from './collections/Audio'
import { Images } from './collections/Images'
import { Pages } from './collections/Pages'
import { Podcasts } from './collections/Podcasts'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: process.env.PREVIEW_URL || 'http://localhost:3000',
      collections: ['artists', 'podcasts', 'pages'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Images, Audio, Artists, Podcasts, Pages],
  editor: lexicalEditor({
    features: () => [
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      LinkFeature(),
      OrderedListFeature(),
      UnorderedListFeature(),
      BlockquoteFeature(),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
      disableLocalStorage: true,
      collections: {
        images: {
          prefix: 'images',
          generateFileURL: ({ filename, prefix }) => {
            const base = process.env.S3_PUBLIC_BASE_URL?.trim()
            if (!base) return filename

            const url = new URL(base)
            const encode = (part: string) => encodeURIComponent(part).replace(/%2F/g, '/')
            const basePath = url.pathname.replace(/\/$/, '')
            const parts = [basePath, prefix, filename]
              .filter(Boolean)
              .map((part) => encode(String(part)))
            url.pathname = parts.join('/')
            return url.toString()
          },
        },
        audio: {
          prefix: 'audio',
          generateFileURL: ({ filename, prefix }) => {
            const base = process.env.S3_PUBLIC_BASE_URL?.trim()
            if (!base) return filename

            const url = new URL(base)
            const encode = (part: string) => encodeURIComponent(part).replace(/%2F/g, '/')
            const basePath = url.pathname.replace(/\/$/, '')
            const parts = [basePath, prefix, filename]
              .filter(Boolean)
              .map((part) => encode(String(part)))
            url.pathname = parts.join('/')
            return url.toString()
          },
        },
      },
    }),
  ],
})

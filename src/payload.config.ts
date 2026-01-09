import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Authors } from './collections/Authors'
import { Media } from './collections/Media'
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
  },
  collections: [Users, Media, Authors, Podcasts],
  editor: lexicalEditor(),
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
        media: {
          // отдаем прямые ссылки из бакета
          generateFileURL: ({ filename, prefix }) => {
            const base = process.env.S3_PUBLIC_BASE_URL?.trim()
            if (!base) return filename // fallback — пусть Payload вернёт стандартный путь

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

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Podcast as PayloadPodcast, Author as PayloadAuthor, Media } from '@/payload-types'
import type { Artist, Podcast } from './data'

// Re-export types for convenience
export type { PayloadPodcast, PayloadAuthor, Media }

// ISR revalidation time in seconds (5 minutes)
export const REVALIDATE_TIME = 300

/**
 * Get Payload instance (cached per request in Next.js)
 */
export async function getPayloadClient() {
  return getPayload({ config })
}

/**
 * Helper to safely get Media URL
 */
function getMediaUrl(media: number | Media | null | undefined): string {
  if (!media) return ''
  if (typeof media === 'number') return ''
  return media.url || ''
}

/**
 * Helper to safely get Media alt text
 */
function getMediaAlt(media: number | Media | null | undefined): string {
  if (!media) return ''
  if (typeof media === 'number') return ''
  return media.alt || ''
}

/**
 * Convert Payload richText (Lexical) to plain text
 */
function richTextToPlainText(value: any): string {
  if (!value || typeof value !== 'object') return ''
  const root = value.root
  if (!root || !Array.isArray(root.children)) return ''

  const traverse = (nodes: any[]): string[] => {
    return nodes.flatMap((node) => {
      if (node.type === 'text' && typeof node.text === 'string') {
        return [node.text]
      }
        if (Array.isArray(node.children)) {
        return traverse(node.children)
      }
      return []
    })
  }

  return traverse(root.children).join(' ').replace(/\s+/g, ' ').trim()
}

/**
 * Convert Payload Author to frontend Artist format
 */
export function mapAuthorToArtist(author: PayloadAuthor): Artist {
  const avatarUrl = getMediaUrl(author.avatar)
  
  return {
    name: author.name,
    slug: author.id.toString(),
    bannerImage: avatarUrl || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&h=400&fit=crop',
    bio: author.bio?.root?.children
      ?.map((child: any) => child.children?.map((c: any) => c.text).join('') || '')
      .join('\n') || undefined,
    socials: author.socials ? {
      vk: author.socials.vk || undefined,
      soundcloud: author.socials.soundcloud || undefined,
      instagram: author.socials.instagram || undefined,
    } : undefined,
  }
}

/**
 * Convert Payload Podcast to frontend Podcast format
 */
export function mapPayloadPodcast(podcast: PayloadPodcast): Podcast {
  const author = podcast.author
  const artists: Artist[] = []

  if (author && typeof author !== 'number') {
    artists.push(mapAuthorToArtist(author))
  }

  const coverUrl = getMediaUrl(podcast.cover)
  const audioUrl = getMediaUrl(podcast.audio)
  const bodyText = richTextToPlainText(podcast.body)

  return {
    number: podcast.slug || podcast.id.toString(),
    title: podcast.title,
    artists,
    coverImage: coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&h=800&fit=crop',
    audioFile: audioUrl,
    description: bodyText || podcast.description || '',
    releaseDate: podcast.publishedAt 
      ? new Date(podcast.publishedAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : new Date(podcast.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    vkUrl: podcast.mirrors?.vk || undefined,
    soundcloudUrl: podcast.mirrors?.soundcloud || undefined,
  }
}

/**
 * Fetch all published podcasts
 */
export async function getPublishedPodcasts(limit = 100): Promise<Podcast[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'podcasts',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit,
    depth: 2, // Populate author and media relationships
  })

  // Sort with fallback to createdAt to guarantee freshest first
  const sortedDocs = [...docs].sort((a, b) => {
    const aDate = new Date(a.publishedAt || a.createdAt).getTime()
    const bDate = new Date(b.publishedAt || b.createdAt).getTime()
    return bDate - aDate
  })

  return sortedDocs.map(mapPayloadPodcast)
}

/**
 * Fetch single podcast by slug
 */
export async function getPodcastBySlug(slug: string): Promise<Podcast | null> {
  const payload = await getPayloadClient()

  // Try to find by slug first
  const { docs } = await payload.find({
    collection: 'podcasts',
    where: {
      or: [
        { slug: { equals: slug } },
        { id: { equals: parseInt(slug) || 0 } },
      ],
    },
    depth: 2,
    limit: 1,
  })

  if (docs.length === 0) return null
  return mapPayloadPodcast(docs[0])
}

/**
 * Fetch all podcasts by author
 */
export async function getPodcastsByAuthor(authorId: string | number): Promise<Podcast[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'podcasts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { author: { equals: typeof authorId === 'string' ? parseInt(authorId) : authorId } },
      ],
    },
    sort: '-publishedAt',
    depth: 2,
  })

  return docs.map(mapPayloadPodcast)
}

/**
 * Fetch all authors
 */
export async function getAllAuthors(): Promise<Artist[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'authors',
    limit: 100,
    depth: 1,
  })

  return docs.map(mapAuthorToArtist)
}

/**
 * Fetch single author by slug (id)
 */
export async function getAuthorBySlug(slug: string): Promise<PayloadAuthor | null> {
  const payload = await getPayloadClient()

  try {
    const author = await payload.findByID({
      collection: 'authors',
      id: parseInt(slug),
      depth: 1,
    })
    return author
  } catch {
    return null
  }
}

/**
 * Get all podcast slugs for static generation
 */
export async function getAllPodcastSlugs(): Promise<string[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'podcasts',
    where: {
      status: { equals: 'published' },
    },
    limit: 1000,
    depth: 0,
  })

  return docs.map(p => p.slug || p.id.toString())
}

/**
 * Get all author slugs for static generation
 */
export async function getAllAuthorSlugs(): Promise<string[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'authors',
    limit: 1000,
    depth: 0,
  })

  return docs.map(a => a.id.toString())
}

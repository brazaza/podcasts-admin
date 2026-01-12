import { getPayload } from 'payload'
import config from '@payload-config'
import type { Podcast as PayloadPodcast, Artist as PayloadArtist, Media } from '@/payload-types'

// Frontend display types
export interface Artist {
  name: string
  slug: string
  bannerImage?: string
  bio?: string
  socials?: {
    vk?: string
    soundcloud?: string
    instagram?: string
  }
}

export interface Podcast {
  number: string
  title: string
  artists: Artist[]
  coverImage: string
  audioFile: string
  description: string
  releaseDate: string
  vkUrl?: string
  soundcloudUrl?: string
}

// Re-export types for convenience
export type { PayloadPodcast, PayloadArtist, Media }

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
function _getMediaAlt(media: number | Media | null | undefined): string {
  if (!media) return ''
  if (typeof media === 'number') return ''
  return media.alt_text || ''
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
 * Convert Payload Artist to frontend Artist format
 */
export function mapPayloadArtist(artist: PayloadArtist): Artist {
  const bannerUrl = getMediaUrl(artist.banner_image)
  
  return {
    name: artist.name,
    slug: artist.slug,
    bannerImage: bannerUrl || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&h=400&fit=crop',
    bio: richTextToPlainText(artist.bio) || undefined,
    socials: artist.socials && typeof artist.socials === 'object' && !Array.isArray(artist.socials) ? {
      vk: (artist.socials as Record<string, string>).vk || undefined,
      soundcloud: (artist.socials as Record<string, string>).soundcloud || undefined,
      instagram: (artist.socials as Record<string, string>).instagram || undefined,
    } : undefined,
  }
}

/**
 * Convert Payload Podcast to frontend Podcast format
 */
export function mapPayloadPodcast(podcast: PayloadPodcast): Podcast {
  const artists: Artist[] = (podcast.artists ?? [])
    .filter((a): a is PayloadArtist => typeof a === 'object' && a !== null)
    .map(mapPayloadArtist)

  const coverUrl = getMediaUrl(podcast.cover)
  const audioUrl = podcast.audio_url || getMediaUrl(podcast.audio)

  return {
    number: podcast.slug || podcast.id.toString(),
    title: podcast.title,
    artists,
    coverImage: coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&h=800&fit=crop',
    audioFile: audioUrl,
    description: podcast.description || '',
    releaseDate: new Date(podcast.release_date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
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
      _status: { equals: 'published' },
    },
    sort: '-release_date',
    limit,
    depth: 2,
  })

  // Sort with fallback to createdAt to guarantee freshest first
  const sortedDocs = [...docs].sort((a, b) => {
    const aDate = new Date(a.release_date || a.createdAt).getTime()
    const bDate = new Date(b.release_date || b.createdAt).getTime()
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
 * Fetch all podcasts by artist
 */
export async function getPodcastsByArtist(artistId: string | number): Promise<Podcast[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'podcasts',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { artists: { contains: typeof artistId === 'string' ? parseInt(artistId) : artistId } },
      ],
    },
    sort: '-release_date',
    depth: 2,
  })

  return docs.map(mapPayloadPodcast)
}

/**
 * Fetch all artists
 */
export async function getAllArtists(): Promise<Artist[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'artists',
    where: {
      _status: { equals: 'published' },
    },
    limit: 100,
    depth: 1,
  })

  return docs.map(mapPayloadArtist)
}

/**
 * Fetch single artist by slug
 */
export async function getArtistBySlug(slug: string): Promise<PayloadArtist | null> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'artists',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth: 1,
  })

  return docs.length > 0 ? docs[0] : null
}

/**
 * Get all podcast slugs for static generation
 */
export async function getAllPodcastSlugs(): Promise<string[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'podcasts',
    where: {
      _status: { equals: 'published' },
    },
    limit: 1000,
    depth: 0,
  })

  return docs.map(p => p.slug || p.id.toString())
}

/**
 * Get all artist slugs for static generation
 */
export async function getAllArtistSlugs(): Promise<string[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'artists',
    where: {
      _status: { equals: 'published' },
    },
    limit: 1000,
    depth: 0,
  })

  return docs.map(a => a.slug)
}

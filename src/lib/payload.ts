import { getPayload } from 'payload'
import config from '@payload-config'
import type { Podcast, Artist, Image, Audio } from '@/payload-types'
import { cache } from 'react'

// Re-export types for convenience
export type { Podcast, Artist, Image, Audio }

// ISR revalidation time in seconds (5 minutes)
export const REVALIDATE_TIME = 300

/**
 * Get Payload instance (cached per request in Next.js)
 */
export const getPayloadClient = cache(async () => {
  return getPayload({ config })
})

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

  return docs
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
      _status: { equals: 'published' }
    },
    depth: 2,
    limit: 1,
  })

  if (docs.length === 0) return null
  return docs[0]
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

  return docs
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

  return docs
}

/**
 * Fetch single artist by slug
 */
export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'artists',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' }
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

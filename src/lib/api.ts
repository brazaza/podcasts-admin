/**
 * API client for fetching data from Payload CMS endpoints
 * Used by frontend pages to fetch artists, podcasts, etc.
 */

import type { Artist, Podcast, Config } from '@/payload-types'
import { PaginatedDocs } from 'payload'

const API_BASE = process.env.NEXT_PUBLIC_SITE_URL || ''

// Re-export Payload types
export type { Artist, Podcast }

// Define Payload's PaginatedDocs type for our use case since we can't easily import the generic
export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface SEOData {
  title?: string | null
  description?: string | null
  image?: string | { url?: string | null } | null
}

/**
 * Fetch all artists
 */
export async function getArtists(options?: {
  isResident?: boolean
  limit?: number
  page?: number
}): Promise<PaginatedResponse<Artist>> {
  const params = new URLSearchParams()

  if (options?.isResident !== undefined) {
    params.set('where[is_resident][equals]', String(options.isResident))
  }
  if (options?.limit) {
    params.set('limit', String(options.limit))
  }
  if (options?.page) {
    params.set('page', String(options.page))
  }
  
  // Ensure we get published artists
  params.set('where[_status][equals]', 'published')

  const res = await fetch(`${API_BASE}/api/artists?${params}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch artists')
  }

  return res.json()
}

/**
 * Fetch single artist by slug
 */
export async function getArtist(slug: string): Promise<Artist> {
  const params = new URLSearchParams()
  params.set('where[slug][equals]', slug)
  params.set('where[_status][equals]', 'published')
  
  const res = await fetch(`${API_BASE}/api/artists?${params}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch artist')
  }

  const data = await res.json()
  
  if (!data.docs?.[0]) {
    throw new Error('Artist not found')
  }

  return data.docs[0]
}

/**
 * Fetch all podcasts
 */
export async function getPodcasts(options?: {
  limit?: number
  page?: number
  artist?: number
}): Promise<PaginatedResponse<Podcast>> {
  const params = new URLSearchParams()

  if (options?.limit) {
    params.set('limit', String(options.limit))
  }
  if (options?.page) {
    params.set('page', String(options.page))
  }
  if (options?.artist) {
    params.set('where[artists][contains]', String(options.artist))
  }

  // Ensure published
  params.set('where[_status][equals]', 'published')
  params.set('sort', '-release_date')

  const res = await fetch(`${API_BASE}/api/podcasts?${params}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch podcasts')
  }

  return res.json()
}

/**
 * Fetch single podcast by slug
 */
export async function getPodcast(slug: string): Promise<Podcast> {
  const params = new URLSearchParams()
  params.set('where[slug][equals]', slug)
  params.set('where[_status][equals]', 'published')

  const res = await fetch(`${API_BASE}/api/podcasts?${params}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch podcast')
  }

  const data = await res.json()

  if (!data.docs?.[0]) {
    throw new Error('Podcast not found')
  }

  return data.docs[0]
}

/**
 * Search artists and podcasts
 * Note: This likely needs a custom endpoint or multiple queries as Payload REST API doesn't support global search easily
 */
export async function search(
  query: string,
  limit = 10,
): Promise<{
  artists: Artist[]
  podcasts: Podcast[]
  totalArtists: number
  totalPodcasts: number
}> {
  // Parallel fetch for artists and podcasts
  const [artistsRes, podcastsRes] = await Promise.all([
    fetch(`${API_BASE}/api/artists?where[name][like]=${query}&limit=${limit}&where[_status][equals]=published`),
    fetch(`${API_BASE}/api/podcasts?where[title][like]=${query}&limit=${limit}&where[_status][equals]=published`)
  ])

  if (!artistsRes.ok || !podcastsRes.ok) {
    throw new Error('Search failed')
  }

  const artistsData = await artistsRes.json()
  const podcastsData = await podcastsRes.json()

  return {
    artists: artistsData.docs,
    podcasts: podcastsData.docs,
    totalArtists: artistsData.totalDocs,
    totalPodcasts: podcastsData.totalDocs
  }
}

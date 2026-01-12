/**
 * API client for fetching data from Payload CMS endpoints
 * Used by frontend pages to fetch artists, podcasts, etc.
 */

const API_BASE = process.env.NEXT_PUBLIC_SITE_URL || ''

export interface Artist {
  id: string
  name: string
  slug: string
  is_resident?: boolean
  bio?: unknown // RichText content
  banner_image?: MediaItem | string
  square_image?: MediaItem | string
  socials?: {
    telegram?: string
    soundcloud?: string
    spotify?: string
    vk?: string
    bandcamp?: string
    instagram?: string
    yandexMusic?: string
    bandlink?: string
  }
  seo?: SEOData
  createdAt: string
  updatedAt: string
}

export interface Podcast {
  id: string
  number: number
  title: string
  slug: string
  description?: string
  release_date: string
  artists?: Artist[]
  audio_url?: string
  audio?: MediaItem
  cover?: MediaItem | string
  mirrors?: {
    vk?: string
    soundcloud?: string
  }
  seo?: SEOData
  createdAt: string
  updatedAt: string
}

export interface MediaItem {
  id: string
  alt_text: string
  url: string
  webp_url?: string
  blurhash?: string
  folder?: 'artists' | 'podcasts' | 'audio'
  mimeType?: string
  filename?: string
  width?: number
  height?: number
}

export interface SEOData {
  title?: string
  description?: string
  image?: MediaItem | string
}

export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
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
    params.set('is_resident', String(options.isResident))
  }
  if (options?.limit) {
    params.set('limit', String(options.limit))
  }
  if (options?.page) {
    params.set('page', String(options.page))
  }

  const res = await fetch(`${API_BASE}/api/public/artists?${params}`, {
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
export async function getArtist(slug: string): Promise<Artist & { podcasts: Podcast[] }> {
  const res = await fetch(`${API_BASE}/api/public/artists/${slug}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Artist not found')
    }
    throw new Error('Failed to fetch artist')
  }

  return res.json()
}

/**
 * Fetch all podcasts
 */
export async function getPodcasts(options?: {
  limit?: number
  page?: number
  artist?: string
}): Promise<PaginatedResponse<Podcast>> {
  const params = new URLSearchParams()

  if (options?.limit) {
    params.set('limit', String(options.limit))
  }
  if (options?.page) {
    params.set('page', String(options.page))
  }
  if (options?.artist) {
    params.set('artist', options.artist)
  }

  const res = await fetch(`${API_BASE}/api/public/podcasts?${params}`, {
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
  const res = await fetch(`${API_BASE}/api/public/podcasts/${slug}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Podcast not found')
    }
    throw new Error('Failed to fetch podcast')
  }

  return res.json()
}

/**
 * Search artists and podcasts
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
  const params = new URLSearchParams({ q: query, limit: String(limit) })

  const res = await fetch(`${API_BASE}/api/search?${params}`, {
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error('Search failed')
  }

  return res.json()
}

/**
 * Get SEO metadata for a path
 */
export async function getSEO(path: string): Promise<SEOData> {
  const params = new URLSearchParams({ path })

  const res = await fetch(`${API_BASE}/api/seo?${params}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    return {
      title: 'SYSTEM108 PODCAST',
      description: 'Official podcast platform for System 108.',
    }
  }

  return res.json()
}

/**
 * Helper to get image URL from media item or string
 */
export function getImageUrl(media: MediaItem | string | undefined | null): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  return media.webp_url || media.url
}

/**
 * Helper to get audio URL from podcast
 */
export function getAudioUrl(podcast: Podcast): string | null {
  if (podcast.audio_url) return podcast.audio_url
  if (podcast.audio && typeof podcast.audio !== 'string') {
    return podcast.audio.url
  }
  return null
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

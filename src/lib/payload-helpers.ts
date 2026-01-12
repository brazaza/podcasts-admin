/**
 * Helper utilities for working with Payload CMS data on the frontend
 */

import type { Artist, Podcast, Media } from '@/payload-types'

// Type guard for Media object
export function isMediaObject(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

/**
 * Get URL from a Media field (which can be a string ID or Media object)
 */
export function getImageUrl(media: string | Media | null | undefined, fallback = ''): string {
  if (!media) return fallback
  if (typeof media === 'string') return media
  return media.webp_url || media.url || fallback
}

/**
 * Get audio URL from a Podcast
 */
export function getAudioUrl(podcast: Podcast): string {
  if (podcast.audio_url) return podcast.audio_url
  if (podcast.audio && isMediaObject(podcast.audio)) {
    return podcast.audio.url || ''
  }
  return ''
}

/**
 * Get cover image URL from a Podcast
 */
export function getCoverUrl(podcast: Podcast, fallback = ''): string {
  if (podcast.cover && isMediaObject(podcast.cover)) {
    return podcast.cover.webp_url || podcast.cover.url || fallback
  }
  return fallback
}

/**
 * Get artist names as a formatted string
 */
export function getArtistNames(artists: Podcast['artists']): string {
  if (!artists || !Array.isArray(artists)) return ''
  return artists
    .map((a) => (typeof a === 'number' ? String(a) : typeof a === 'string' ? a : a.name))
    .join(' b2b ')
}

/**
 * Format release date for display
 */
export function formatReleaseDate(date: string | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Get banner image URL from an Artist
 */
export function getArtistBannerUrl(artist: Artist, fallback = ''): string {
  if (artist.banner_image && isMediaObject(artist.banner_image)) {
    return artist.banner_image.webp_url || artist.banner_image.url || fallback
  }
  return fallback
}

/**
 * Get square image URL from an Artist
 */
export function getArtistSquareUrl(artist: Artist, fallback = ''): string {
  if (artist.square_image && isMediaObject(artist.square_image)) {
    return artist.square_image.webp_url || artist.square_image.url || fallback
  }
  return getArtistBannerUrl(artist, fallback)
}

/**
 * Get socials object from an Artist
 */
export function getArtistSocials(artist: Artist): Record<string, string> {
  if (!artist.socials) return {}
  if (typeof artist.socials === 'object' && !Array.isArray(artist.socials)) {
    return artist.socials as Record<string, string>
  }
  return {}
}

/**
 * Audio player simplified artist type
 */
export interface AudioArtist {
  name: string
  slug: string
}

/**
 * Audio player simplified podcast type
 */
export interface AudioPodcast {
  id: string
  number: number
  title: string
  audioFile: string
  coverImage: string
  artists: AudioArtist[]
}

/**
 * Convert Payload Podcast to AudioPodcast for the player
 */
export function podcastToAudioPodcast(podcast: Podcast): AudioPodcast {
  const artists: AudioArtist[] = (podcast.artists ?? [])
    .filter((a): a is Artist => typeof a === 'object' && a !== null)
    .map((a) => ({ name: a.name, slug: a.slug }))

  return {
    id: String(podcast.id),
    number: podcast.number,
    title: podcast.title,
    audioFile: getAudioUrl(podcast),
    coverImage: getCoverUrl(podcast),
    artists,
  }
}

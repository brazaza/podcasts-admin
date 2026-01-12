/**
 * Helper utilities for working with Payload CMS data on the frontend
 */

import type { Artist, Podcast, Image, Audio } from '@/payload-types'

// Type guard for Image object
export function isImageObject(value: unknown): value is Image {
  return typeof value === 'object' && value !== null && 'url' in value
}

// Type guard for Audio object
export function isAudioObject(value: unknown): value is Audio {
  return typeof value === 'object' && value !== null && 'url' in value
}

/**
 * Get URL from an Image field (which can be a string ID or Image object)
 */
export function getImageUrl(image: string | Image | null | undefined, fallback = ''): string {
  if (!image) return fallback
  if (typeof image === 'string') return image
  return image.url || fallback
}

/**
 * Get BlurHash from an Image field
 */
export function getImageBlurHash(image: string | Image | null | undefined): string | null {
  if (!image || typeof image === 'string') return null
  return image.blurHash || null
}

/**
 * Get audio URL from a Podcast
 */
export function getAudioUrl(podcast: Podcast): string {
  if (podcast.audio_url) return podcast.audio_url
  if (podcast.audio && isAudioObject(podcast.audio)) {
    return podcast.audio.url || ''
  }
  return ''
}

/**
 * Get cover image URL from a Podcast
 */
export function getCoverUrl(podcast: Podcast, fallback = ''): string {
  if (podcast.cover && isImageObject(podcast.cover)) {
    return podcast.cover.url || fallback
  }
  return fallback
}

/**
 * Get cover BlurHash from a Podcast
 */
export function getCoverBlurHash(podcast: Podcast): string | null {
  if (podcast.cover && isImageObject(podcast.cover)) {
    return podcast.cover.blurHash || null
  }
  return null
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
  if (artist.banner_image && isImageObject(artist.banner_image)) {
    return artist.banner_image.url || fallback
  }
  return fallback
}

/**
 * Get banner BlurHash from an Artist
 */
export function getArtistBannerBlurHash(artist: Artist): string | null {
  if (artist.banner_image && isImageObject(artist.banner_image)) {
    return artist.banner_image.blurHash || null
  }
  return null
}

/**
 * Get square image URL from an Artist
 */
export function getArtistSquareUrl(artist: Artist, fallback = ''): string {
  if (artist.square_image && isImageObject(artist.square_image)) {
    return artist.square_image.url || fallback
  }
  return getArtistBannerUrl(artist, fallback)
}

/**
 * Get square image BlurHash from an Artist
 */
export function getArtistSquareBlurHash(artist: Artist): string | null {
  if (artist.square_image && isImageObject(artist.square_image)) {
    return artist.square_image.blurHash || null
  }
  return getArtistBannerBlurHash(artist)
}

/**
 * Social media link type
 */
export interface ArtistSocialLink {
  platform: string
  url: string
  icon: 'yandex_music' | 'spotify' | 'bandlink' | 'bandcamp' | 'telegram' | 'instagram' | 'tiktok' | 'vk' | 'link'
}

/**
 * Get all social links from an Artist as an array
 */
export function getArtistSocialLinks(artist: Artist): ArtistSocialLink[] {
  const links: ArtistSocialLink[] = []

  if (artist.yandex_music) links.push({ platform: 'Yandex Music', url: artist.yandex_music, icon: 'yandex_music' })
  if (artist.spotify) links.push({ platform: 'Spotify', url: artist.spotify, icon: 'spotify' })
  if (artist.bandlink) links.push({ platform: 'Bandlink', url: artist.bandlink, icon: 'bandlink' })
  if (artist.bandcamp) links.push({ platform: 'Bandcamp', url: artist.bandcamp, icon: 'bandcamp' })
  if (artist.telegram) links.push({ platform: 'Telegram', url: artist.telegram, icon: 'telegram' })
  if (artist.instagram) links.push({ platform: 'Instagram', url: artist.instagram, icon: 'instagram' })
  if (artist.tiktok) links.push({ platform: 'TikTok', url: artist.tiktok, icon: 'tiktok' })
  if (artist.vk) links.push({ platform: 'VK', url: artist.vk, icon: 'vk' })

  // Add extra links with generic link icon
  if (artist.extra_links && Array.isArray(artist.extra_links)) {
    for (const link of artist.extra_links) {
      if (link.url && link.label) {
        links.push({ platform: link.label, url: link.url, icon: 'link' })
      }
    }
  }

  return links
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

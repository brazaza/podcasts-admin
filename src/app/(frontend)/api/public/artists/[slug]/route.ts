import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/public/artists/:slug
 * Fetch single artist by slug with related podcasts
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const payload = await getPayload({ config })
    const { slug } = await params

    // Find artist by slug
    const artists = await payload.find({
      collection: 'artists',
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
      limit: 1,
      depth: 2,
      overrideAccess: false,
    })

    if (artists.docs.length === 0) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    const artist = artists.docs[0]

    // Find related podcasts featuring this artist
    const podcasts = await payload.find({
      collection: 'podcasts',
      where: {
        artists: { contains: artist.id },
        _status: { equals: 'published' },
      },
      limit: 50,
      depth: 2,
      overrideAccess: false,
      sort: '-release_date',
    })

    return NextResponse.json({
      ...artist,
      podcasts: podcasts.docs,
    })
  } catch (error) {
    console.error('[API /public/artists/:slug] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 })
  }
}

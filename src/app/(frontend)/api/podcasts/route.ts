import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/podcasts
 * Fetch all podcasts with pagination
 * Query params:
 * - limit: number - limit results (default: 20)
 * - page: number - pagination (default: 1)
 * - artist: string - filter by artist slug
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const artistSlug = searchParams.get('artist')

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      _status: { equals: 'published' },
    }

    // If filtering by artist, first find the artist ID
    if (artistSlug) {
      const artists = await payload.find({
        collection: 'artists',
        where: { slug: { equals: artistSlug } },
        limit: 1,
        depth: 0,
      })
      
      if (artists.docs.length > 0) {
        where.artists = { contains: artists.docs[0].id }
      }
    }

    const podcasts = await payload.find({
      collection: 'podcasts',
      where,
      limit,
      page,
      depth: 2,
      overrideAccess: false,
      sort: '-release_date',
    })

    return NextResponse.json({
      docs: podcasts.docs,
      totalDocs: podcasts.totalDocs,
      totalPages: podcasts.totalPages,
      page: podcasts.page,
      hasNextPage: podcasts.hasNextPage,
      hasPrevPage: podcasts.hasPrevPage,
    })
  } catch (error) {
    console.error('[API /podcasts] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch podcasts' },
      { status: 500 }
    )
  }
}

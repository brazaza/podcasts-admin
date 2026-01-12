import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/search
 * Search across artists and podcasts
 * Query params:
 * - q: string - search query (required)
 * - limit: number - limit per collection (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Search artists
    const artists = await payload.find({
      collection: 'artists',
      where: {
        or: [
          { name: { contains: query } },
          { 'bio': { contains: query } },
        ],
        _status: { equals: 'published' },
      },
      limit,
      depth: 1,
      overrideAccess: false,
    })

    // Search podcasts
    const podcasts = await payload.find({
      collection: 'podcasts',
      where: {
        or: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
        _status: { equals: 'published' },
      },
      limit,
      depth: 2,
      overrideAccess: false,
      sort: '-release_date',
    })

    return NextResponse.json({
      artists: artists.docs,
      podcasts: podcasts.docs,
      totalArtists: artists.totalDocs,
      totalPodcasts: podcasts.totalDocs,
    })
  } catch (error) {
    console.error('[API /search] Error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}

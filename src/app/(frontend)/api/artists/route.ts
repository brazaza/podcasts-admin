import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/artists
 * Fetch all artists with optional filtering
 * Query params:
 * - is_resident: boolean - filter by resident status
 * - limit: number - limit results (default: 100)
 * - page: number - pagination (default: 1)
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const isResident = searchParams.get('is_resident')
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const page = parseInt(searchParams.get('page') || '1', 10)

    // Build where clause
    const where: Where = {
      _status: { equals: 'published' },
    }
    
    if (isResident !== null) {
      where.is_resident = { equals: isResident === 'true' }
    }

    const artists = await payload.find({
      collection: 'artists',
      where,
      limit,
      page,
      depth: 2,
      overrideAccess: false,
      sort: 'name',
    })

    return NextResponse.json({
      docs: artists.docs,
      totalDocs: artists.totalDocs,
      totalPages: artists.totalPages,
      page: artists.page,
      hasNextPage: artists.hasNextPage,
      hasPrevPage: artists.hasPrevPage,
    })
  } catch (error) {
    console.error('[API /artists] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    )
  }
}

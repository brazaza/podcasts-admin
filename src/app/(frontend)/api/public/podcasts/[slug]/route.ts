import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/public/podcasts/:slug
 * Fetch single podcast by slug
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const payload = await getPayload({ config })
    const { slug } = await params

    // Find podcast by slug
    const podcasts = await payload.find({
      collection: 'podcasts',
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
      limit: 1,
      depth: 2,
      overrideAccess: false,
    })

    if (podcasts.docs.length === 0) {
      return NextResponse.json({ error: 'Podcast not found' }, { status: 404 })
    }

    return NextResponse.json(podcasts.docs[0])
  } catch (error) {
    console.error('[API /public/podcasts/:slug] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch podcast' }, { status: 500 })
  }
}

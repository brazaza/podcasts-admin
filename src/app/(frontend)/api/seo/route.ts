import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/seo
 * Fetch SEO metadata for a given path
 * Query params:
 * - path: string - URL path (required, e.g., /artist/kovyazin-d)
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      )
    }

    // Parse path to determine content type and slug
    const pathParts = path.split('/').filter(Boolean)
    
    // Default SEO
    const defaultSeo = {
      title: 'SYSTEM108 PODCAST',
      description: 'Official podcast platform for System 108. Deep house, techno, and beyond.',
      image: null,
    }

    if (pathParts.length === 0 || path === '/') {
      return NextResponse.json(defaultSeo)
    }

    const [type, slug] = pathParts

    try {
      if (type === 'artist' && slug) {
        const artists = await payload.find({
          collection: 'artists',
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 1,
          overrideAccess: false,
        })

        if (artists.docs.length > 0) {
          const artist = artists.docs[0]
          return NextResponse.json({
            title: artist.seo?.title || `${artist.name} | SYSTEM108`,
            description: artist.seo?.description || artist.bio || `Explore podcasts by ${artist.name}`,
            image: artist.seo?.image || artist.banner_image,
          })
        }
      }

      if (type === 'podcast' && slug) {
        const podcasts = await payload.find({
          collection: 'podcasts',
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 1,
          overrideAccess: false,
        })

        if (podcasts.docs.length > 0) {
          const podcast = podcasts.docs[0]
          return NextResponse.json({
            title: podcast.seo?.title || `${podcast.title} | SYSTEM108`,
            description: podcast.seo?.description || podcast.description,
            image: podcast.seo?.image || podcast.cover,
          })
        }
      }

      // Check pages collection
      const pages = await payload.find({
        collection: 'pages',
        where: { slug: { equals: pathParts.join('/') } },
        limit: 1,
        depth: 1,
        overrideAccess: false,
      })

      if (pages.docs.length > 0) {
        const page = pages.docs[0]
        return NextResponse.json({
          title: page.seo?.title || `${page.title} | SYSTEM108`,
          description: page.seo?.description,
          image: page.seo?.image,
        })
      }
    } catch {
      // Fall through to default
    }

    return NextResponse.json(defaultSeo)
  } catch (error) {
    console.error('[API /seo] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SEO data' },
      { status: 500 }
    )
  }
}

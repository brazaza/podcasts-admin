import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { draftMode } from 'next/headers'

/**
 * GET /api/preview
 * Enable preview mode for draft content
 * Query params:
 * - secret: string - preview secret (required, must match PREVIEW_SECRET)
 * - slug: string - content slug (required)
 * - type: string - content type: 'artist', 'podcast', or 'page' (required)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const secret = searchParams.get('secret')
    const slug = searchParams.get('slug')
    const type = searchParams.get('type')

    // Validate secret
    const previewSecret = process.env.PREVIEW_SECRET
    if (!previewSecret || secret !== previewSecret) {
      return NextResponse.json(
        { error: 'Invalid preview secret' },
        { status: 401 }
      )
    }

    if (!slug || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters: slug and type' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['artist', 'podcast', 'page']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Verify content exists (including drafts)
    const payload = await getPayload({ config })
    const collectionMap: Record<string, string> = {
      artist: 'artists',
      podcast: 'podcasts',
      page: 'pages',
    }

    const collection = collectionMap[type]
    
    const content = await payload.find({
      collection: collection as 'artists' | 'podcasts' | 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      draft: true,
      overrideAccess: true, // Admin preview needs full access
    })

    if (content.docs.length === 0) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Enable draft mode
    const draft = await draftMode()
    draft.enable()

    // Build redirect URL
    const pathMap: Record<string, string> = {
      artist: `/artist/${slug}`,
      podcast: `/podcast/${slug}`,
      page: slug === 'home' ? '/' : `/${slug}`,
    }

    const redirectUrl = pathMap[type]

    // Redirect to content page
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  } catch (error) {
    console.error('[API /preview] Error:', error)
    return NextResponse.json(
      { error: 'Preview failed' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/preview/disable
 * Disable preview mode
 */
export async function POST() {
  try {
    const draft = await draftMode()
    draft.disable()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API /preview/disable] Error:', error)
    return NextResponse.json(
      { error: 'Failed to disable preview' },
      { status: 500 }
    )
  }
}

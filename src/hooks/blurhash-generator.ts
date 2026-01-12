import type { PayloadRequest } from 'payload'
import sharp from 'sharp'
import { encode } from 'blurhash'

interface ImageDoc {
  id: string
  filename?: string
  url?: string
  mimeType?: string
}

/**
 * Generate BlurHash for an image document.
 * Uses sharp for image processing (already in Payload) and blurhash for encoding.
 * 
 * Algorithm:
 * 1. Get image buffer from URL or local file
 * 2. Resize to 32x32 with sharp (maintaining aspect ratio)
 * 3. Convert to raw RGBA buffer
 * 4. Encode with blurhash (4x4 components)
 */
export async function generateBlurHash(
  doc: ImageDoc,
  _req: PayloadRequest
): Promise<string | null> {
  if (!doc.url) {
    console.log(`[BlurHash] No URL for document ${doc.id}`)
    return null
  }

  try {
    const imageBuffer = await fetchImageBuffer(doc.url)
    if (!imageBuffer) {
      console.log(`[BlurHash] Could not fetch image buffer for ${doc.filename}`)
      return null
    }

    const { data, info } = await sharp(imageBuffer)
      .resize(32, 32, { fit: 'inside' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const blurHash = encode(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
      4,
      4
    )

    console.log(`[BlurHash] Generated for ${doc.filename}: ${blurHash}`)
    return blurHash
  } catch (error) {
    console.error(`[BlurHash] Error processing ${doc.filename}:`, error)
    return null
  }
}

/**
 * Fetch image as buffer from URL (supports both HTTP and local file paths)
 */
async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const response = await fetch(url)
      if (!response.ok) {
        console.error(`[BlurHash] Failed to fetch ${url}: ${response.status}`)
        return null
      }
      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    }

    // Local file path - use sharp directly
    return await sharp(url).toBuffer()
  } catch (error) {
    console.error(`[BlurHash] Error fetching image buffer:`, error)
    return null
  }
}

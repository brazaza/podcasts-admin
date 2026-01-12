import type { CollectionAfterChangeHook } from 'payload'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Hook to process media files after upload:
 * - Generate WebP version for images
 * - Generate blurhash for images
 * - Extract duration for audio files using ffprobe
 * 
 * Note: sharp is available via Payload's built-in sharp instance
 * ffprobe must be installed on the system (path configurable via FFPROBE_PATH env)
 */
export const mediaProcessingHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  context,
}) => {
  // Prevent infinite loops
  if (context?.skipMediaProcessing) return doc
  if (operation !== 'create') return doc

  const { payload } = req
  const mimeType = doc.mimeType || ''
  const isImage = mimeType.startsWith('image/')
  const isAudio = mimeType.startsWith('audio/')

  if (!isImage && !isAudio) return doc

  const updates: Record<string, unknown> = {}

  try {
    if (isImage && doc.url) {
      // WebP conversion and blurhash generation
      // Note: In production, this would be done via sharp
      // For now, we'll store the original URL and mark for processing
      updates.original_url = doc.url
      
      // Blurhash generation would happen here with sharp
      // Example: const blurhash = await generateBlurhash(doc.url)
      // updates.blurhash = blurhash
      
      // WebP URL would be generated after conversion
      // updates.webp_url = webpUrl
      
      console.log(`[Media Processing] Image uploaded: ${doc.filename}, ready for WebP/blurhash processing`)
    }

    if (isAudio && doc.url) {
      // Extract duration using ffprobe
      const ffprobePath = process.env.FFPROBE_PATH || 'ffprobe'
      
      try {
        const { stdout } = await execAsync(
          `"${ffprobePath}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${doc.url}"`
        )
        const duration = parseFloat(stdout.trim())
        if (!isNaN(duration)) {
          updates.duration_seconds = Math.round(duration)
          console.log(`[Media Processing] Audio duration extracted: ${duration}s for ${doc.filename}`)
        }
      } catch (ffprobeError) {
        console.error(`[Media Processing] ffprobe error for ${doc.filename}:`, ffprobeError)
        // Don't fail the upload if ffprobe fails
      }
    }

    // Update the document with processed data if we have updates
    if (Object.keys(updates).length > 0) {
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: updates,
        req,
        context: { skipMediaProcessing: true },
      })
    }
  } catch (error) {
    console.error(`[Media Processing] Error processing ${doc.filename}:`, error)
    // Don't throw - let the upload succeed even if processing fails
  }

  return doc
}

/**
 * Generate blurhash from image buffer using sharp
 * TODO: Implement actual blurhash generation
 */
export async function generateBlurhash(_imageUrl: string): Promise<string | null> {
  // Implementation would use sharp to resize image and encode-blurhash
  // Example implementation:
  // const sharp = require('sharp')
  // const { encode } = require('blurhash')
  // const { data, info } = await sharp(imageBuffer)
  //   .raw()
  //   .ensureAlpha()
  //   .resize(32, 32, { fit: 'inside' })
  //   .toBuffer({ resolveWithObject: true })
  // return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4)
  
  return null
}

/**
 * Convert image to WebP format
 * TODO: Implement actual WebP conversion
 */
export async function convertToWebP(_imageUrl: string): Promise<string | null> {
  // Implementation would use sharp to convert to WebP
  // and upload to S3 with .webp extension
  
  return null
}

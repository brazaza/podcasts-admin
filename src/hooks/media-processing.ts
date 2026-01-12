import type { CollectionAfterChangeHook } from 'payload'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Hook to process audio files after upload:
 * - Extract duration for audio files using ffprobe
 * 
 * Note: ffprobe must be installed on the system (path configurable via FFPROBE_PATH env)
 * BlurHash generation for images is handled in the Images collection hook.
 */
export const audioProcessingHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  context,
}) => {
  // Prevent infinite loops
  if (context?.skipAudioProcessing) return doc
  if (operation !== 'create') return doc

  const { payload } = req
  const mimeType = doc.mimeType || ''
  const isAudio = mimeType.startsWith('audio/')

  if (!isAudio) return doc

  const updates: Record<string, unknown> = {}

  try {
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
          console.log(`[Audio Processing] Duration extracted: ${duration}s for ${doc.filename}`)
        }
      } catch (ffprobeError) {
        console.error(`[Audio Processing] ffprobe error for ${doc.filename}:`, ffprobeError)
        // Don't fail the upload if ffprobe fails
      }
    }

    // Update the document with processed data if we have updates
    if (Object.keys(updates).length > 0) {
      await payload.update({
        collection: 'audio',
        id: doc.id,
        data: updates,
        req,
        context: { skipAudioProcessing: true },
      })
    }
  } catch (error) {
    console.error(`[Audio Processing] Error processing ${doc.filename}:`, error)
    // Don't throw - let the upload succeed even if processing fails
  }

  return doc
}

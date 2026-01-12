import type { CollectionAfterChangeHook } from 'payload'

/**
 * Trigger rebuild webhook when content is published.
 * Only triggers when _status changes to 'published'.
 * Configurable via REBUILD_WEBHOOK_URL and REBUILD_WEBHOOK_SECRET env vars.
 */
export const rebuildWebhook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  context,
}) => {
  // Prevent infinite loops and skip if no webhook configured
  if (context?.skipRebuildWebhook) return doc
  
  const webhookUrl = process.env.REBUILD_WEBHOOK_URL
  if (!webhookUrl) return doc

  // Only trigger on update operations
  if (operation !== 'update') return doc

  // Check if status changed to published
  const wasPublished = previousDoc?._status === 'published'
  const isPublished = doc._status === 'published'
  
  // Only trigger when transitioning TO published state
  if (wasPublished || !isPublished) return doc

  const webhookSecret = process.env.REBUILD_WEBHOOK_SECRET || ''

  try {
    console.log(`[Rebuild Webhook] Triggering rebuild for ${doc.id}...`)
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(webhookSecret && { 'X-Webhook-Secret': webhookSecret }),
      },
      body: JSON.stringify({
        event: 'publish',
        collection: doc._collection || 'unknown',
        id: doc.id,
        slug: doc.slug,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      console.error(`[Rebuild Webhook] Failed with status ${response.status}`)
    } else {
      console.log(`[Rebuild Webhook] Successfully triggered rebuild`)
    }
  } catch (error) {
    console.error('[Rebuild Webhook] Error triggering webhook:', error)
    // Don't throw - let the publish succeed even if webhook fails
  }

  return doc
}

/**
 * Create a reusable hook factory for collections with drafts
 */
export function createRebuildHook(collectionName: string): CollectionAfterChangeHook {
  return async ({ doc, previousDoc, operation, context }) => {
    if (context?.skipRebuildWebhook) return doc
    
    const webhookUrl = process.env.REBUILD_WEBHOOK_URL
    if (!webhookUrl) return doc
    if (operation !== 'update') return doc

    const wasPublished = previousDoc?._status === 'published'
    const isPublished = doc._status === 'published'
    
    if (wasPublished || !isPublished) return doc

    const webhookSecret = process.env.REBUILD_WEBHOOK_SECRET || ''

    try {
      console.log(`[Rebuild Webhook] Triggering rebuild for ${collectionName}/${doc.id}...`)
      
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(webhookSecret && { 'X-Webhook-Secret': webhookSecret }),
        },
        body: JSON.stringify({
          event: 'publish',
          collection: collectionName,
          id: doc.id,
          slug: doc.slug,
          timestamp: new Date().toISOString(),
        }),
      })
      
      console.log(`[Rebuild Webhook] Successfully triggered for ${collectionName}`)
    } catch (error) {
      console.error(`[Rebuild Webhook] Error for ${collectionName}:`, error)
    }

    return doc
  }
}

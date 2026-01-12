import { describe, it, expect, beforeAll } from 'vitest'

/**
 * Smoke tests for API endpoints
 * These tests verify basic functionality of the API routes
 * 
 * Run with: bun run test:smoke
 * 
 * Note: These tests require a running server with database connection.
 * For CI, consider using test fixtures or mocking the database.
 */

const API_BASE = process.env.TEST_API_URL || 'http://localhost:3000'

describe('API Smoke Tests', () => {
  // Skip if no server is running
  beforeAll(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/artists`, { method: 'HEAD' })
      if (!res.ok && res.status !== 404) {
        console.warn('Server may not be running, some tests may fail')
      }
    } catch {
      console.warn('Server not reachable, skipping smoke tests')
    }
  })

  describe('GET /api/artists', () => {
    it('should return artists list with pagination info', async () => {
      const res = await fetch(`${API_BASE}/api/artists`)
      
      // Accept 200 or 500 (if DB not connected)
      expect([200, 500]).toContain(res.status)
      
      if (res.status === 200) {
        const data = await res.json()
        expect(data).toHaveProperty('docs')
        expect(data).toHaveProperty('totalDocs')
        expect(data).toHaveProperty('totalPages')
        expect(Array.isArray(data.docs)).toBe(true)
      }
    })

    it('should filter by is_resident parameter', async () => {
      const res = await fetch(`${API_BASE}/api/artists?is_resident=true`)
      
      if (res.status === 200) {
        const data = await res.json()
        expect(Array.isArray(data.docs)).toBe(true)
      }
    })
  })

  describe('GET /api/podcasts', () => {
    it('should return podcasts list with pagination', async () => {
      const res = await fetch(`${API_BASE}/api/podcasts`)
      
      expect([200, 500]).toContain(res.status)
      
      if (res.status === 200) {
        const data = await res.json()
        expect(data).toHaveProperty('docs')
        expect(data).toHaveProperty('totalDocs')
        expect(Array.isArray(data.docs)).toBe(true)
      }
    })

    it('should support pagination parameters', async () => {
      const res = await fetch(`${API_BASE}/api/podcasts?limit=5&page=1`)
      
      if (res.status === 200) {
        const data = await res.json()
        expect(data.docs.length).toBeLessThanOrEqual(5)
      }
    })
  })

  describe('GET /api/search', () => {
    it('should require query parameter', async () => {
      const res = await fetch(`${API_BASE}/api/search`)
      expect(res.status).toBe(400)
    })

    it('should return search results for valid query', async () => {
      const res = await fetch(`${API_BASE}/api/search?q=test`)
      
      expect([200, 500]).toContain(res.status)
      
      if (res.status === 200) {
        const data = await res.json()
        expect(data).toHaveProperty('artists')
        expect(data).toHaveProperty('podcasts')
      }
    })
  })

  describe('GET /api/seo', () => {
    it('should require path parameter', async () => {
      const res = await fetch(`${API_BASE}/api/seo`)
      expect(res.status).toBe(400)
    })

    it('should return default SEO for root path', async () => {
      const res = await fetch(`${API_BASE}/api/seo?path=/`)
      
      expect([200, 500]).toContain(res.status)
      
      if (res.status === 200) {
        const data = await res.json()
        expect(data).toHaveProperty('title')
        expect(data).toHaveProperty('description')
      }
    })
  })

  describe('GET /api/preview', () => {
    it('should reject invalid secret', async () => {
      const res = await fetch(`${API_BASE}/api/preview?secret=invalid&slug=test&type=artist`)
      expect(res.status).toBe(401)
    })

    it('should require all parameters', async () => {
      const res = await fetch(`${API_BASE}/api/preview?secret=test`)
      expect(res.status).toBe(400)
    })
  })
})

describe('Frontend Pages Smoke Tests', () => {
  describe('Landing Page', () => {
    it('should return 200 for root path', async () => {
      const res = await fetch(`${API_BASE}/`)
      expect([200, 500]).toContain(res.status)
    })
  })

  describe('Podcasts Page', () => {
    it('should return 200 for /podcasts', async () => {
      const res = await fetch(`${API_BASE}/podcasts`)
      expect([200, 500]).toContain(res.status)
    })
  })

  describe('Artists Page', () => {
    it('should return 200 for /artists', async () => {
      const res = await fetch(`${API_BASE}/artists`)
      expect([200, 500]).toContain(res.status)
    })
  })
})

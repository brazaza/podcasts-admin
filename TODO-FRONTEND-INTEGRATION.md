# Frontend Integration TODO

This document outlines the remaining work needed to fully integrate the frontend with the Payload CMS backend.

## Completed Work

### Backend (Payload CMS)
- [x] Updated collections: Artists, Podcasts, Media, Pages
- [x] Added drafts + autosave support
- [x] Live preview configuration in admin
- [x] S3 storage with folder organization
- [x] Media processing hooks (WebP, blurhash, ffprobe - placeholders)
- [x] Rebuild webhook hook for publish events
- [x] API endpoints: /api/artists, /api/podcasts, /api/search, /api/seo, /api/preview
- [x] Updated .env.example with all required variables
- [x] Smoke tests for API endpoints

### Frontend Structure
- [x] Imported new frontend from orchids-system108-podcasts-front
- [x] Updated layout.tsx (removed duplicate html/body tags)
- [x] Updated AudioProvider to work with new types
- [x] Updated podcasts/page.tsx to fetch from Payload
- [x] Updated artists/page.tsx to fetch from Payload
- [x] Updated artist/[slug]/page.tsx to fetch from Payload

## Remaining Work

### Frontend Pages (Priority: High)
1. **podcast/[slug]/page.tsx** - Update to fetch from Payload
   - Replace `@/lib/data` import with Payload fetch
   - Update property references: `coverImage` → `cover`, `audioFile` → `audio_url`
   - Update artist references to use new schema

2. **not-found.tsx** - Remove dependency on `@/lib/data`
   - Simplify to not require data fetching

3. **page.tsx (landing)** - Already static, may need minor updates

### Components (Priority: High)
1. **podcast-card.tsx** - Update to use new Podcast type
   - `coverImage` → `cover` (Media object)
   - `audioFile` → `audio_url` or `audio.url`
   - `releaseDate` → `release_date`
   - `artists` array structure updated

2. **artist-card.tsx** - Update to use new Artist type
   - `bannerImage` → `banner_image` (Media object)
   - `isResident` → `is_resident`

3. **featured-hero.tsx** - Update to use new Podcast type
   - Similar changes as podcast-card.tsx

4. **podcast-grid.tsx** - Update to use new Podcast type

5. **podcast-slider.tsx** - Update to use new Podcast type

6. **audio-player.tsx** - Already partially updated
   - May need additional type fixes

7. **podcast-page-player.tsx** - Update to use new Podcast type

### Type Definitions
- Create `src/lib/types.ts` with frontend-friendly type aliases
- Map Payload types to frontend component props

### Utility Functions
- Create `src/lib/payload-helpers.ts` with:
  - `getImageUrl(media)` - Extract URL from Media object
  - `getAudioUrl(podcast)` - Get audio URL from podcast
  - `formatReleaseDate(date)` - Format date for display

## Schema Mapping Reference

### Artist
| Old Field | New Field | Notes |
|-----------|-----------|-------|
| name | name | Same |
| slug | slug | Same |
| bannerImage | banner_image | Now Media upload |
| mobileImage | square_image | Now Media upload |
| bio | bio | Now RichText (Lexical) |
| isResident | is_resident | Boolean |
| socials.* | socials | JSON field |

### Podcast
| Old Field | New Field | Notes |
|-----------|-----------|-------|
| number | number | Now numeric |
| title | title | Same |
| artists | artists | Relationship to artists collection |
| coverImage | cover | Now Media upload |
| audioFile | audio_url or audio | Text URL or Media upload |
| description | description | Same |
| releaseDate | release_date | Date field |
| vkUrl | mirrors.vk | Nested in mirrors group |
| soundcloudUrl | mirrors.soundcloud | Nested in mirrors group |

## Future Enhancements (TODO)

### RBAC Implementation
- Add roles field to Users collection: admin, editor, author
- Create role-based access control functions in `src/access/`
- Update collection access functions to use roles
- Reference: See TODO comments in collection files

### Media Processing
- Implement actual WebP conversion using sharp
- Implement blurhash generation
- Set up ffprobe on hosting environment
- Reference: `src/hooks/media-processing.ts`

### Extra Sections / Blocks
- Extend PAGE_BLOCKS in Pages collection as needed
- Use extra_sections JSON field for custom extensibility

### Pages Collection Usage
- Create template pages editable from admin
- Build dynamic page renderer for layout blocks

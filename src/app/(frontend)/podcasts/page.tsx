import { getPayload } from 'payload'
import config from '@payload-config'
import { FeaturedHero } from "@/components/featured-hero";
import { PodcastGrid } from "@/components/podcast-grid";

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default async function PodcastsPage() {
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'podcasts',
    where: { _status: { equals: 'published' } },
    sort: '-release_date',
    depth: 2,
    limit: 100,
  })

  const podcasts = result.docs
  const featuredPodcast = podcasts[0]
  const remainingPodcasts = podcasts.slice(1)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      {featuredPodcast && <FeaturedHero podcast={featuredPodcast} />}

      {/* Main Grid Section */}
      <div className="max-w-[1400px] mx-auto px-6 py-24 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none font-display">
              Latest Releases
            </h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4 ml-1">
              Exploring the sonic landscape of System 108
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black tracking-tighter text-white">
              {result.totalDocs.toString().padStart(3, '0')}
            </span>
          </div>
        </div>

        <PodcastGrid initialPodcasts={remainingPodcasts} />
      </div>
    </div>
  );
}

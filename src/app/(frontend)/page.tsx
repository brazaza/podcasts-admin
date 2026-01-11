import { PodcastCard } from "@/components/podcast-card";
import { FeaturedHero } from "@/components/featured-hero";
import { PodcastGrid } from "@/components/podcast-grid";
import { getPublishedPodcasts, REVALIDATE_TIME } from "@/lib/payload";

export const revalidate = REVALIDATE_TIME;

export default async function HomePage() {
  const podcasts = await getPublishedPodcasts();
  
  const featuredPodcast = podcasts[0];
  const remainingPodcasts = podcasts.slice(1);

  if (!featuredPodcast) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-zinc-500 uppercase font-black tracking-widest">
          No podcasts available yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <FeaturedHero podcast={featuredPodcast} />

      {/* Main Grid Section */}
      <div className="max-w-[1400px] mx-auto px-6 py-24 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.8] font-display">
              Latest Releases
            </h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4 ml-1">
              Exploring the sonic landscape of System 108
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black tracking-tighter opacity-10">
              {podcasts.length.toString().padStart(3, '0')}
            </span>
          </div>
        </div>

        <PodcastGrid initialPodcasts={remainingPodcasts} />
      </div>
    </div>
  );
}

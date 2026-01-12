import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from "next/navigation";
import Link from "next/link";
import { PodcastSlider as _PodcastSlider } from "@/components/podcast-slider";
import { Metadata } from "next";
import { ListenNowButton } from "@/components/listen-now-button";
import { PodcastPagePlayer } from "@/components/podcast-page-player";
import { ShareDropdown } from "@/components/share-dropdown";
import { getCoverUrl, formatReleaseDate } from "@/lib/payload-helpers";
import type { Artist } from "@/payload-types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic'
export const revalidate = 60

const VKIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.162 18.994c-6.098 0-9.57-4.172-9.714-11.108h3.047c.105 5.092 2.348 7.247 4.127 7.691V7.886h2.868v4.39c1.755-.188 3.606-2.18 4.228-4.39h2.868c-.464 2.686-2.433 4.678-3.84 5.32 1.407.656 3.658 2.406 4.453 5.788h-3.141c-.622-1.94-2.168-3.435-4.568-3.673v3.673h-2.868z" />
  </svg>
);

const SoundCloudIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.56 16.5c0 .35-.04.68-.11 1.01l-.22.99H20.5c1.93 0 3.5-1.57 3.5-3.5 0-1.83-1.42-3.33-3.21-3.48-.12-3.15-2.73-5.52-5.79-5.52-2.19 0-4.14 1.25-5.07 3.09-.28-.06-.57-.09-.87-.09-1.95 0-3.56 1.44-3.85 3.32-.45-.14-.93-.22-1.42-.22-2.48 0-4.5 2.02-4.5 4.5 0 .28.03.55.08.82L0 18.5h9.44l.22-1.01c.07-.31.11-.64.11-.99 0-1.38-.56-2.63-1.47-3.54C9.2 12.38 10.3 12 11.5 12c1.2 0 2.3.38 3.2 1.04-.91.91-1.47 2.16-1.47 3.54v.96h-1.67v-1.04z" />
  </svg>
);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'podcasts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })
  
  const podcast = result.docs[0]
  if (!podcast) return { title: "Not Found" };

  const coverUrl = getCoverUrl(podcast, 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1200&h=630&fit=crop')

  return {
    title: `${podcast.title} | SYSTEM108`,
    description: podcast.description || undefined,
    openGraph: {
      title: podcast.title,
      description: podcast.description || undefined,
      images: [coverUrl],
    },
  };
}

export default async function PodcastPage({ params }: PageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'podcasts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })

  const podcast = result.docs[0]
  if (!podcast) notFound();

  const artists = (podcast.artists || []).filter((a): a is Artist => typeof a !== 'number')
  const coverUrl = getCoverUrl(podcast, 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&h=800&fit=crop')
  
  const titleLength = podcast.title.length;
  const artistsLength = artists.reduce((acc: number, a) => acc + (a.name?.length || 0), 0);

  const getTitleSize = () => {
    const words = podcast.title.split(' ');
    const longestWord = Math.max(...words.map(w => w.length));
    
    if (longestWord >= 12 || titleLength > 25) return "text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl";
    if (longestWord >= 10 || titleLength > 20) return "text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl";
    if (longestWord >= 8 || titleLength > 15) return "text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl";
    if (longestWord >= 7 || titleLength > 12) return "text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl";
    if (longestWord >= 5) return "text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-7xl";
    return "text-5xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-8xl";
  };

  const getArtistSize = () => {
    if (artistsLength > 40) return "text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl";
    if (artistsLength > 25) return "text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl";
    return "text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl";
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-8 pb-48">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-24 relative">
        {/* Left: Square Cover - Sticky on Desktop */}
        <div className="md:sticky md:top-24 aspect-square bg-zinc-900 overflow-hidden border border-white/5">
          <img src={coverUrl} alt={podcast.title} className="w-full h-full object-cover" />
        </div>

          {/* Right: Info */}
          <div className="space-y-8 min-w-0 overflow-hidden">
            <div className="space-y-4">
              <h1 className={`${getTitleSize()} font-black tracking-tighter uppercase leading-[0.9] font-display group/title w-fit text-yellow-400 transition-colors`}>
                {podcast.title.split(' ').map((word, idx) => (
                  <span key={idx} className="block relative w-fit whitespace-nowrap">
                    {word}
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-400 transition-all duration-700 group-hover/title:w-full" />
                  </span>
                ))}
              </h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {artists.map((artist, i) => (
                <div key={artist.slug} className="flex items-center gap-x-2">
                          <Link 
                            href={`/artist/${artist.slug}`}
                            className={`${getArtistSize()} font-black text-yellow-400 transition-colors uppercase tracking-tighter relative w-fit group`}
                          >
                            {artist.name}
                              <span className="absolute bottom-[2px] left-0 w-0 h-1 bg-yellow-400 transition-all duration-700 group-hover:w-full" />
                          </Link>
                  {i < artists.length - 1 && (
                    <span className="text-lg font-black text-white uppercase">b2b</span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] pt-2">
              Released {formatReleaseDate(podcast.release_date)}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <ListenNowButton podcast={podcast} />
            <div className="flex items-center gap-4">
              <a href={podcast.mirrors?.vk || "#"} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <VKIcon className="w-6 h-6" />
              </a>
              <a href={podcast.mirrors?.soundcloud || "#"} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <SoundCloudIcon className="w-6 h-6" />
              </a>
              
                    <ShareDropdown 
                      path={`/podcast/${podcast.number}`}
                      title={podcast.title}
                      triggerClassName="opacity-50 hover:opacity-100 transition-opacity p-0 h-auto w-auto"
                      iconClassName="w-6 h-6"
                    />
              </div>
            </div>

          <div className="prose prose-invert max-w-none text-zinc-400 font-medium whitespace-pre-line leading-relaxed">
            {podcast.description}
          </div>

          {/* Waveform Player moved here */}
          <div className="mt-12 bg-zinc-900/30 p-6 border border-white/5">
            <PodcastPagePlayer podcast={podcast} />
          </div>
        </div>
      </div>

      {/* Artist Information Blocks */}
      {artists.length > 0 && (
        <section>
          <h2 className="text-2xl font-black tracking-tighter uppercase mb-8 border-b border-white/10 pb-4">
            Artists
          </h2>
          <div className={artists.length % 2 === 0 ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-6"}>
            {artists.map((artist) => {
              const bannerUrl = typeof artist.banner_image === 'object' && artist.banner_image?.url 
                ? artist.banner_image.url 
                : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&h=400&fit=crop'
              
              return (
                <Link 
                  key={artist.slug}
                  href={`/artist/${artist.slug}`}
                  className={`group relative h-72 overflow-hidden bg-zinc-900 border border-white/5 ${artists.length % 2 !== 0 ? "w-full" : ""}`}
                >
                  <img 
                    src={bannerUrl} 
                    alt={artist.name} 
                    className="w-full h-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80" 
                  />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-4xl font-black tracking-tighter uppercase text-yellow-400 relative w-fit">
                      {artist.name}
                      <span className="absolute bottom-[2px] left-0 w-0 h-1 bg-yellow-400 transition-all duration-700 group-hover:w-full" />
                    </h3>
                    {artist.seo?.description && (
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2 line-clamp-2 max-w-md">
                        {artist.seo.description}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  );
}

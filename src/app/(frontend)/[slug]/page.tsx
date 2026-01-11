import { notFound } from "next/navigation";
import Link from "next/link";
import { PodcastCard } from "@/components/podcast-card";
import { Metadata } from "next";
import { ListenNowButton } from "@/components/listen-now-button";
import { PodcastPagePlayer } from "@/components/podcast-page-player";
import { Share2, Download, Copy, Twitter, Facebook } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  getPodcastBySlug, 
  getPublishedPodcasts, 
  getAllPodcastSlugs,
} from "@/lib/payload";

// ISR: 5 minutes
export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

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

export async function generateStaticParams() {
  const slugs = await getAllPodcastSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const podcast = await getPodcastBySlug(slug);
  
  if (!podcast) return { title: "Not Found" };

  return {
    title: `${podcast.title} | SYSTEM108`,
    description: podcast.description,
    openGraph: {
      title: podcast.title,
      description: podcast.description,
      images: [podcast.coverImage],
    },
  };
}

export default async function PodcastPage({ params }: PageProps) {
  const { slug } = await params;
  const [podcast, allPodcasts] = await Promise.all([
    getPodcastBySlug(slug),
    getPublishedPodcasts(),
  ]);

  if (!podcast) notFound();

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 pb-48">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-24">
        {/* Left: Square Cover */}
        <div className="aspect-square bg-zinc-900 overflow-hidden border border-white/5">
          <img src={podcast.coverImage} alt={podcast.title} className="w-full h-full object-cover" />
        </div>

        {/* Right: Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] font-display">
              {podcast.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {podcast.artists.map((artist, i) => (
                <div key={artist.slug} className="flex items-center gap-x-2">
                  <Link 
                    href={`/artist/${artist.slug}`}
                    className="text-2xl md:text-3xl font-black hover:underline uppercase tracking-tighter"
                  >
                    {artist.name}
                  </Link>
                  {i < podcast.artists.length - 1 && (
                    <span className="text-lg font-black text-zinc-700 uppercase">b2b</span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] pt-2">
              Released {podcast.releaseDate}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <ListenNowButton podcast={podcast} />
            <div className="flex items-center gap-4">
              <a href={podcast.vkUrl || "#"} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <VKIcon className="w-6 h-6" />
              </a>
              <a href={podcast.soundcloudUrl || "#"} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <SoundCloudIcon className="w-6 h-6" />
              </a>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="opacity-50 hover:opacity-100 transition-opacity">
                    <Share2 className="w-6 h-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top" className="bg-zinc-900 border-white/10 text-white rounded-none min-w-[150px]">
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer flex items-center gap-2 uppercase font-black text-[10px] tracking-widest">
                    <Copy className="w-3 h-3" /> Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer flex items-center gap-2 uppercase font-black text-[10px] tracking-widest">
                    <VKIcon className="w-3 h-3" /> VK
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10 cursor-pointer flex items-center gap-2 uppercase font-black text-[10px] tracking-widest">
                    <Twitter className="w-3 h-3" /> Twitter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <a href={podcast.audioFile} download className="opacity-50 hover:opacity-100 transition-opacity">
                <Download className="w-6 h-6" />
              </a>
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

      {/* More Podcasts Section for EACH artist */}
      <section className="space-y-24 mb-24">
        {podcast.artists.map((artist) => {
          const artistPodcasts = allPodcasts.filter(p => 
            p.number !== podcast.number && 
            p.artists.some(a => a.slug === artist.slug)
          ).slice(0, 4);

          if (artistPodcasts.length === 0) return null;

          return (
            <div key={artist.slug}>
              <h2 className="text-2xl font-black tracking-tighter uppercase mb-8 border-b border-white/10 pb-4">
                More podcasts by {artist.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {artistPodcasts.map((p) => (
                  <PodcastCard key={p.number} podcast={p} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Artist Information Blocks with even/odd layout logic */}
      <section>
        <h2 className="text-2xl font-black tracking-tighter uppercase mb-8 border-b border-white/10 pb-4">
          Artists
        </h2>
        <div className={podcast.artists.length % 2 === 0 ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-6"}>
          {podcast.artists.map((artist) => (
            <Link 
              key={artist.slug}
              href={`/artist/${artist.slug}`}
              className={`group relative h-72 overflow-hidden bg-zinc-900 border border-white/5 ${podcast.artists.length % 2 !== 0 ? "w-full" : ""}`}
            >
              <img 
                src={artist.bannerImage} 
                alt={artist.name} 
                className="w-full h-full object-cover grayscale opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-60 group-hover:grayscale-0" 
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black to-transparent">
                <h3 className="text-4xl font-black tracking-tighter uppercase">{artist.name}</h3>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2 line-clamp-2 max-w-md">
                  {artist.bio}
                </p>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all mt-4 flex items-center gap-2">
                  View Profile <span className="text-lg">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

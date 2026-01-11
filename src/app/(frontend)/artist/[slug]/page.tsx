import { notFound } from "next/navigation";
import { PodcastCard } from "@/components/podcast-card";
import { Metadata } from "next";
import { FaVk, FaSoundcloud, FaInstagram, FaSpotify, FaTelegramPlane, FaBandcamp } from "react-icons/fa";
import { SiYandexcloud } from "react-icons/si";
import { 
  getAuthorBySlug, 
  getPodcastsByAuthor, 
  getAllAuthorSlugs,
  mapAuthorToArtist,
} from "@/lib/payload";

// ISR: 5 minutes
export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  
  if (!author) return { title: "Artist Not Found" };

  const artist = mapAuthorToArtist(author);
  
  return {
    title: `${artist.name} | SYSTEM108`,
    description: artist.bio || `Explore podcasts by ${artist.name} on System 108.`,
    openGraph: {
      title: artist.name,
      description: artist.bio,
      images: [artist.bannerImage],
    },
  };
}

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params;
  const [author, artistPodcasts] = await Promise.all([
    getAuthorBySlug(slug),
    getPodcastsByAuthor(slug),
  ]);

  if (!author) notFound();

  const artist = mapAuthorToArtist(author);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <img 
          src={artist.bannerImage} 
          alt={artist.name} 
          className="w-full h-full object-cover grayscale brightness-[0.3]" 
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div className="space-y-6">
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] font-display">
                {artist.name}
              </h1>
              {artist.bio && (
                <div className="max-w-xl border-l-4 border-white pl-6">
                  <p className="text-sm md:text-base font-bold text-zinc-400 uppercase tracking-tight leading-relaxed">
                    {artist.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Socials Block */}
            <div className="flex flex-wrap gap-4 lg:justify-end pb-2">
              <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-4 gap-3">
                {artist.socials?.telegram && (
                  <a href={artist.socials.telegram} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10">
                    <FaTelegramPlane size={20} />
                  </a>
                )}
                {artist.socials?.soundcloud && (
                  <a href={artist.socials.soundcloud} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10">
                    <FaSoundcloud size={20} />
                  </a>
                )}
                {artist.socials?.spotify && (
                  <a href={artist.socials.spotify} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10">
                    <FaSpotify size={20} />
                  </a>
                )}
                {artist.socials?.vk && (
                  <a href={artist.socials.vk} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10">
                    <FaVk size={20} />
                  </a>
                )}
                {artist.socials?.bandcamp && (
                  <a href={artist.socials.bandcamp} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10">
                    <FaBandcamp size={20} />
                  </a>
                )}
                {artist.socials?.instagram && (
                  <a href={artist.socials.instagram} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10">
                    <FaInstagram size={20} />
                  </a>
                )}
                {/* Fallback fillers for demonstration */}
                {!artist.socials && (
                  <>
                    <a href="#" className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10">
                      <FaTelegramPlane size={20} />
                    </a>
                    <a href="#" className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10">
                      <FaSoundcloud size={20} />
                    </a>
                    <a href="#" className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10">
                      <FaSpotify size={20} />
                    </a>
                    <a href="#" className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10">
                      <FaVk size={20} />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-24 w-full">
        <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
          <h2 className="text-3xl font-black tracking-tighter uppercase">
            Podcasts featuring {artist.name}
          </h2>
          <span className="text-xs font-black opacity-30 uppercase tracking-widest">
            {artistPodcasts.length} Releases
          </span>
        </div>

        {artistPodcasts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artistPodcasts.map((podcast) => (
              <PodcastCard key={podcast.number} podcast={podcast} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-zinc-500 uppercase font-black tracking-widest">No podcasts found for this artist.</p>
          </div>
        )}
      </div>
    </div>
  );
}

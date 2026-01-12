import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from "next/navigation";
import Link from "next/link";
import { PodcastCard } from "@/components/podcast-card";
import { Metadata } from "next";
import type React from "react";
import { FaVk, FaInstagram, FaSpotify, FaTelegramPlane, FaTiktok, FaLink, FaMusic } from "react-icons/fa";
import { SiBandcamp } from "react-icons/si";
import { ShareDropdown } from "@/components/share-dropdown";
import { getArtistSocialLinks, type ArtistSocialLink } from "@/lib/payload-helpers";

function getSocialIcon(icon: ArtistSocialLink['icon']) {
  const icons: Record<ArtistSocialLink['icon'], React.ComponentType<{ size?: number; className?: string }>> = {
    yandex_music: FaMusic,
    spotify: FaSpotify,
    bandlink: FaLink,
    bandcamp: SiBandcamp,
    telegram: FaTelegramPlane,
    instagram: FaInstagram,
    tiktok: FaTiktok,
    vk: FaVk,
    link: FaLink,
  }
  return icons[icon] || FaLink
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic'
export const revalidate = 60

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'artists',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })
  
  const artist = result.docs[0]
  if (!artist) return { title: "Artist Not Found" };

  const bannerUrl = typeof artist.banner_image === 'object' && artist.banner_image?.url 
    ? artist.banner_image.url 
    : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1200&h=630&fit=crop'

  return {
    title: `${artist.name} | SYSTEM108`,
    description: artist.seo?.description || `Explore podcasts by ${artist.name} on System 108.`,
    openGraph: {
      title: artist.name,
      description: artist.seo?.description || undefined,
      images: [bannerUrl],
    },
  };
}

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config })
  
  const artistResult = await payload.find({
    collection: 'artists',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })

  const artist = artistResult.docs[0]
  if (!artist) notFound();

  // Find podcasts featuring this artist
  const podcastResult = await payload.find({
    collection: 'podcasts',
    where: { 
      artists: { contains: artist.id },
      _status: { equals: 'published' },
    },
    sort: '-release_date',
    depth: 2,
    limit: 50,
  })

  const artistPodcasts = podcastResult.docs
  
  // Get social links using new structure
  const socialLinks = getArtistSocialLinks(artist)
  
  // Get image URLs
  const bannerUrl = typeof artist.banner_image === 'object' && artist.banner_image?.url 
    ? artist.banner_image.url 
    : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1600&h=400&fit=crop'
  const squareUrl = typeof artist.square_image === 'object' && artist.square_image?.url 
    ? artist.square_image.url 
    : bannerUrl

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-auto md:h-[60vh] md:min-h-[500px] overflow-hidden aspect-square md:aspect-auto">
        <img 
          src={squareUrl} 
          alt={artist.name} 
          className="w-full h-full object-cover brightness-[0.4] md:hidden" 
        />
        <img 
          src={bannerUrl} 
          alt={artist.name} 
          className="w-full h-full object-cover brightness-[0.4] hidden md:block" 
        />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-[1400px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-end w-full">
                <div className="space-y-6 min-w-0">
                      <h1 className="flex flex-col font-black tracking-tighter uppercase leading-[0.7] font-display min-w-0 text-yellow-400">
                        {artist.name.split(' ').map((word: string, i: number, arr: string[]) => {
                          const wordLen = word.length;
                          const wordCount = arr.length;
                          
                            let fontSize = "clamp(1.5rem, 8vw, 7rem)";
                            
                            if (wordLen > 15) {
                              fontSize = "clamp(1rem, 2vw, 2rem)";
                            } else if (wordLen > 12) {
                              fontSize = "clamp(1.2rem, 2.5vw, 2.8rem)";
                            } else if (wordLen > 10) {
                              fontSize = "clamp(1.4rem, 3vw, 3.8rem)";
                            } else if (wordLen > 8) {
                              fontSize = "clamp(1.5rem, 3.5vw, 4.5rem)";
                            } else if (wordCount > 3) {
                              fontSize = "clamp(1.5rem, 4.5vw, 4.5rem)";
                            }

                          return (
                            <span 
                              key={i} 
                              style={{ fontSize }}
                              className="block whitespace-nowrap"
                            >
                              {word}
                            </span>
                          );
                        })}
                      </h1>

                {artist.seo?.description && (
                  <div className="max-w-xl border-l-4 border-white pl-4 md:pl-6">
                    <p className="text-[10px] md:text-xs lg:text-sm font-bold text-zinc-400 uppercase tracking-tight leading-relaxed line-clamp-4 md:line-clamp-none">
                      {artist.seo.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Socials Block */}
              <div className="flex flex-wrap gap-2 md:gap-4 lg:justify-end pb-2">
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {socialLinks.map((link) => {
                      const IconComponent = getSocialIcon(link.icon)
                      return (
                        <a 
                          key={link.url} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10 shrink-0"
                          title={link.platform}
                        >
                          <IconComponent size={18} className="md:w-5 md:h-5" />
                        </a>
                      )
                    })}
                    <ShareDropdown 
                      path={`/artist/${artist.slug}`}
                      title={`Listen to ${artist.name} on SYSTEM108`}
                      triggerClassName="w-10 h-10 md:w-12 md:h-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                      iconClassName="w-[18px] h-[18px] md:w-5 md:h-5"
                      invertOnOpen={true}
                    />
                  </div>
                </div>
              </div>
            </div>
  
        </div>

        {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-24 w-full">
          <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
            <h2 className="text-3xl font-black tracking-tighter uppercase">
              Podcasts featuring <Link 
                href={`/artist/${artist.slug}`} 
                className="text-yellow-400 uppercase relative group/artist inline-block"
              >
                {artist.name}
                <span className="absolute bottom-[1px] left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-700 group-hover/artist:w-full" />
              </Link>
            </h2>
            <span className="text-xs font-black text-white uppercase tracking-widest">
              {artistPodcasts.length} Releases
            </span>
          </div>

          {artistPodcasts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 sm:gap-x-4 md:gap-x-6 gap-y-6 sm:gap-y-10 md:gap-y-12">
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

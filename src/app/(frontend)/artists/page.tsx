import { getPayload } from 'payload'
import config from '@payload-config'
import { ArtistCard } from "@/components/artist-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artists | SYSTEM108",
  description: "Explore the residents and friends of the SYSTEM108 label.",
};

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default async function ArtistsPage() {
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'artists',
    where: { _status: { equals: 'published' } },
    sort: 'name',
    depth: 2,
    limit: 100,
  })

  const artists = result.docs
  const residents = artists.filter((a) => a.is_resident)
  const friends = artists.filter((a) => !a.is_resident)

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 pt-8 pb-24 w-full space-y-24">
        
        {/* Residents Section */}
        <section>
          <div className="flex items-center justify-between mb-12 border-b border-white pb-6">
            <h2 className="text-3xl font-black tracking-tighter uppercase">
              Our Residents
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 sm:gap-x-4 md:gap-x-6 gap-y-6 sm:gap-y-10 md:gap-y-12">
            {residents.map((artist) => (
              <ArtistCard key={artist.slug} artist={artist} />
            ))}
          </div>
        </section>

        {/* Friends Section */}
        {friends.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-12 border-b border-white pb-6">
              <h2 className="text-3xl font-black tracking-tighter uppercase">
                Our Friends
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 sm:gap-x-4 md:gap-x-6 gap-y-6 sm:gap-y-10 md:gap-y-12">
              {friends.map((artist) => (
                <ArtistCard key={artist.slug} artist={artist} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

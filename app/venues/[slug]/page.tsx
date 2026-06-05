import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";

const imageBySlug: Record<string, string> = {
  boschendal: "/venues/boschendal.jpg",
  spier: "/venues/spier.jpg",
  root44: "/venues/root44.jpg",
  babylonstoren: "/venues/boschendal.jpg",
};

type VenuePageProps = {
  params: {
    slug: string;
  };
};

type Venue = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  address: string | null;
  city: string | null;
  website: string | null;
};

async function getVenue(slug: string): Promise<Venue | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/venues/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function VenuePage({ params }: VenuePageProps) {
  const venue = await getVenue(params.slug);

  if (!venue) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] p-8 text-[#1E2A28]">
        <Link href="/" className="font-bold text-[#C26D3A]">
          ← Back to Detour
        </Link>

        <h1 className="mt-8 text-4xl font-bold">Venue not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] text-[#1E2A28]">
      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-[#C26D3A]"
          >
            <ArrowLeft size={18} />
            Back to Detour
          </Link>

          <div className="mt-8 overflow-hidden rounded-[2rem] bg-white shadow-xl">
            <Image
              src={imageBySlug[venue.slug] || "/venues/boschendal.jpg"}
              alt={venue.name}
              width={1200}
              height={650}
              className="h-[420px] w-full object-cover"
              priority
            />

            <div className="p-8 md:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#C26D3A]">
                {venue.city || "Experience"}
              </p>

              <h1 className="mt-3 text-5xl font-bold text-[#1F4D42]">
                {venue.name}
              </h1>

              <p className="mt-4 max-w-3xl text-lg text-gray-600">
                {venue.full_description || venue.short_description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-gray-600">
                <MapPin size={18} className="text-[#C26D3A]" />
                <span>
                  {venue.address}, {venue.city}
                </span>
              </div>

              {venue.website && (
                <a
                  href={venue.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#C26D3A] px-6 py-3 font-bold text-white"
                >
                  Visit Website
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
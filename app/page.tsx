import Image from "next/image";
import {
  Bike,
  Footprints,
  MapPin,
  Mountain,
  Search,
  Trophy,
  Users,
  Utensils,
  Wine,
} from "lucide-react";

const categories = [
  { icon: Wine, name: "Wine Farms" },
  { icon: Utensils, name: "Restaurants" },
  { icon: Footprints, name: "Running" },
  { icon: Mountain, name: "Hiking" },
  { icon: Bike, name: "MTB" },
  { icon: Trophy, name: "Padel" },
  { icon: Users, name: "Family" },
];

const featuredVenues = [
  {
    name: "Boschendal",
    category: "Wine Farm",
    distance: "12.4 km away",
    tags: ["Child Friendly", "Wine Tasting", "Outdoor"],
  },
  {
    name: "Spier",
    category: "Wine Farm",
    distance: "15.2 km away",
    tags: ["Family", "Restaurant", "Experiences"],
  },
  {
    name: "Root44",
    category: "Lifestyle Market",
    distance: "18.7 km away",
    tags: ["Food", "Family", "Weekend"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F5F2] text-[#1E2A28]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Image
            src="/logo.svg"
            alt="Detour logo"
            width={150}
            height={44}
            priority
          />

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#explore" className="font-medium hover:text-[#C26D3A]">
              Explore
            </a>
            <a href="#categories" className="font-medium hover:text-[#C26D3A]">
              Categories
            </a>
            <a href="#featured" className="font-medium hover:text-[#C26D3A]">
              Featured
            </a>
            <a
              href="#ask"
              className="rounded-full bg-[#C26D3A] px-5 py-3 font-bold text-white"
            >
              Ask Detour
            </a>
          </nav>
        </div>
      </header>

      <section id="explore" className="px-6 py-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#1F4D42] shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-8 text-white md:p-12 lg:p-14">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-[#D8C3A5]">
              Discover • Explore • Detour
            </p>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-7xl">
              Find your next <span className="text-[#D8C3A5]">detour.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-white/80">
              Discover wine farms, restaurants, padel venues, trails and family
              experiences near you.
            </p>

            <div className="mt-8 rounded-full bg-white p-3 shadow-xl">
              <div className="flex items-center gap-3">
                <Search className="ml-2 text-[#C26D3A]" size={24} />
                <input
                  className="w-full bg-transparent px-2 py-3 text-[#1E2A28] outline-none"
                  placeholder="Find a child-friendly wine farm near me..."
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <button className="rounded-full bg-[#C26D3A] px-8 py-4 font-bold text-white">
                Use My Location
              </button>

              <button className="rounded-full border border-white/30 px-8 py-4 font-bold text-white">
                Ask Detour
              </button>
            </div>
          </div>

          <div className="relative min-h-[420px] bg-gradient-to-br from-[#D8C3A5] via-[#6B7D4F] to-[#1F4D42]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_25%),radial-gradient(circle_at_80%_60%,rgba(194,109,58,0.35),transparent_28%)]" />

            <div className="absolute bottom-8 left-8 right-8 rounded-3xl bg-white/90 p-6 shadow-xl backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C26D3A]">
                Nearby Experience
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#1F4D42]">
                Wine farms, trails and family stops.
              </h2>
              <p className="mt-2 text-gray-600">
                Detour will recommend places based on your location and
                preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="px-6 pb-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-3xl font-bold">Explore Categories</h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.name}
                  className="rounded-2xl bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F5F2] text-[#C26D3A]">
                    <Icon size={24} />
                  </div>
                  <div className="font-semibold">{category.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.45fr]">
          <section id="featured">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold">Featured Experiences</h2>
              <button className="font-bold text-[#C26D3A]">View all →</button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {featuredVenues.map((venue, index) => (
                <div
                  key={venue.name}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`h-44 ${
                      index === 0
                        ? "bg-gradient-to-br from-[#D8C3A5] to-[#1F4D42]"
                        : index === 1
                        ? "bg-gradient-to-br from-[#6B7D4F] to-[#D8C3A5]"
                        : "bg-gradient-to-br from-[#C26D3A] to-[#1F4D42]"
                    }`}
                  />

                  <div className="p-6">
                    <div className="text-sm font-bold uppercase tracking-wider text-[#C26D3A]">
                      {venue.category}
                    </div>

                    <h3 className="mt-2 text-2xl font-bold">{venue.name}</h3>

                    <p className="mt-2 flex items-center gap-2 text-gray-600">
                      <MapPin size={16} className="text-[#C26D3A]" />
                      {venue.distance}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {venue.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#F7F5F2] px-3 py-1 text-sm text-[#1F4D42]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button className="mt-5 font-bold text-[#C26D3A]">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            id="ask"
            className="rounded-3xl bg-white p-6 shadow-sm lg:self-start"
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#C26D3A]">
              Ask Detour
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Natural language discovery is coming.
            </h2>

            <p className="mt-3 text-gray-600">
              Soon you’ll be able to ask questions like:
            </p>

            <div className="mt-4 rounded-2xl bg-[#F7F5F2] p-4 text-gray-700">
              “Find a child-friendly wine farm within 20km that serves lunch.”
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
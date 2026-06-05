"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapPin, MessageCircle, Search, X } from "lucide-react";

const priorityFilters = [
  "Wine Farm",
  "Restaurant",
  "Coffee Shop",
  "Child Friendly",
  "MTB Trail",
  "Hiking Trail",
  "Running Trail",
  "Padel Courts",
];

const imageBySlug: Record<string, string> = {
  boschendal: "/venues/boschendal/hero.jpg",
  spier: "/venues/spier/hero.jpg",
  root44: "/venues/root44/hero.jpg",
  babylonstoren: "/venues/babylonstoren/hero.jpg",
};

type Venue = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  city: string | null;
  latitude: number;
  longitude: number;
  attributes: string[];
  distance?: number;
};

type Attribute = {
  id: string;
  name: string;
};

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<{
  latitude: number;
  longitude: number;
} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [venuesResponse, attributesResponse] = await Promise.all([
        fetch("/api/venues"),
        fetch("/api/attributes"),
      ]);

      setVenues(await venuesResponse.json());
      setAttributes(await attributesResponse.json());
      setLoading(false);
    }

    loadData();
  }, []);

  function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function getUserLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    () => {
  alert("Using Cape Town as a demo location.");
  
  setUserLocation({
    latitude: -33.9249,
    longitude: 18.4241,
  });
}
  );
}
  const visibleFilters = useMemo(() => {
    return attributes
      .filter((attribute) => priorityFilters.includes(attribute.name))
      .sort(
        (a, b) =>
          priorityFilters.indexOf(a.name) - priorityFilters.indexOf(b.name)
      );
  }, [attributes]);

  const filteredVenues = useMemo(() => {
  const search = searchTerm.trim().toLowerCase();

  const results = venues.filter((venue) => {
    const matchesFilters =
      selectedFilters.length === 0 ||
      selectedFilters.every((filter) =>
        venue.attributes.includes(filter)
      );

    const searchableText = [
      venue.name,
      venue.city,
      venue.short_description,
      ...(venue.attributes || []),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      search.length === 0 || searchableText.includes(search);

    return matchesFilters && matchesSearch;
  });

  if (!userLocation) {
    return results;
  }

  return results
    .map((venue) => ({
      ...venue,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        venue.latitude,
        venue.longitude
      ),
    }))
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
}, [venues, selectedFilters, searchTerm, userLocation]);

  function toggleFilter(filter: string) {
    setSelectedFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter]
    );
  }

  function resetSearch() {
    setSearchTerm("");
    setSelectedFilters([]);
  }

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
            <a href="#places" className="font-medium hover:text-[#C26D3A]">
              Places
            </a>
          </nav>
        </div>
      </header>

      <section id="explore" className="px-6 py-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0F3F35] px-8 py-10 text-white shadow-2xl md:px-12 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-start">
            <div>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <h1 className="text-5xl font-bold leading-tight md:text-6xl">
                  Find your next{" "}
                  <span className="text-[#D8C3A5]">detour.</span>
                </h1>

                <div className="hidden h-16 w-px bg-white/25 lg:block" />

                <p className="max-w-xl text-lg text-white/85">
                  Discover wine farms, restaurants, padel venues, trails and
                  family experiences near you.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#C26D3A]">
                Live Discovery
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">
                {loading
                  ? "Loading venues..."
                  : `${filteredVenues.length} places found.`}
              </h2>
              <p className="mt-2 text-white/75">
                Search and filter places by what they offer.
              </p>
              <button
  onClick={getUserLocation}
  className="mt-4 rounded-full bg-[#C26D3A] px-5 py-3 font-bold text-white"
>
  {userLocation ? "Location Enabled" : "Use My Location"}
</button>
            </div>
          </div>

          <div className="mt-9 grid gap-6 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#C26D3A]">
                Search by Keyword
              </p>

              <div className="rounded-full bg-white p-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <Search className="ml-2 text-[#C26D3A]" size={24} />

                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full bg-transparent px-2 py-3 text-[#1E2A28] outline-none"
                    placeholder="Search by venue, city or attribute..."
                  />

                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mr-2 rounded-full bg-[#F7F5F2] p-2 text-[#1F4D42]"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              <p className="mt-3 text-sm text-white/70">
                Try: coffee, stellenbosch, mtb, spier
              </p>
            </div>

            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-[#C26D3A]">
                <MessageCircle size={17} />
                Ask Detour{" "}
                <span className="text-[#D8C3A5]">(Coming Soon)</span>
              </p>

              <div className="rounded-full border border-white/20 bg-white/10 p-3">
                <div className="flex items-center gap-3">
                  <MessageCircle className="ml-2 text-[#D8C3A5]" size={22} />

                  <input
                    disabled
                    className="w-full bg-transparent px-2 py-3 text-white/70 outline-none placeholder:text-white/65"
                    placeholder="Ask in natural language..."
                  />

                  <button
                    disabled
                    className="mr-1 rounded-full bg-white/20 p-3 text-white/80"
                  >
                    →
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm text-white/75">
                Example: “Find a child-friendly wine farm within 20km that
                serves lunch.”
              </p>
            </div>
          </div>

          {(searchTerm || selectedFilters.length > 0) && (
            <div className="mt-5 text-sm text-white/80">
              {searchTerm && <p>Showing results for “{searchTerm}”</p>}
              {selectedFilters.length > 0 && (
                <p>Filters: {selectedFilters.join(", ")}</p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#C26D3A]">
                Filter by ...
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                What are you looking for?
              </h2>
            </div>

            {(selectedFilters.length > 0 || searchTerm) && (
              <button
                onClick={resetSearch}
                className="rounded-full border border-[#1F4D42] px-5 py-2 font-bold text-[#1F4D42]"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {visibleFilters.map((attribute) => {
              const selected = selectedFilters.includes(attribute.name);

              return (
                <button
                  key={attribute.id}
                  onClick={() => toggleFilter(attribute.name)}
                  className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                    selected
                      ? "bg-[#1F4D42] text-white"
                      : "bg-[#F7F5F2] text-[#1F4D42] hover:bg-[#D8C3A5]"
                  }`}
                >
                  {selected ? "✓ " : ""}
                  {attribute.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="places" className="px-6 pb-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Discover Places</h2>
            <p className="font-bold text-[#C26D3A]">
              Showing {filteredVenues.length} of {venues.length} places
            </p>
          </div>

          {filteredVenues.length === 0 && !loading && (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <h3 className="text-2xl font-bold text-[#1F4D42]">
                No places found
              </h3>
              <p className="mt-3 text-gray-600">
                Try clearing your filters or searching for something else.
              </p>
              <button
                onClick={resetSearch}
                className="mt-5 rounded-full bg-[#C26D3A] px-6 py-3 font-bold text-white"
              >
                Reset Search & Filters
              </button>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filteredVenues.map((venue) => (
              <Link
                key={venue.id}
                href={`/venues/${venue.slug}`}
                className="block cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:ring-2 hover:ring-[#C26D3A]"
              >
                <Image
                  src={
                    imageBySlug[venue.slug] || "/venues/boschendal/hero.jpg"
                  }
                  alt={venue.name}
                  width={600}
                  height={360}
                  className="h-44 w-full object-cover"
                />

                <div className="p-6">
                  <div className="text-sm font-bold uppercase tracking-wider text-[#C26D3A]">
                    {venue.city || "Experience"}
                  </div>

                  <h3 className="mt-2 text-2xl font-bold">{venue.name}</h3>

                  <p className="mt-2 flex items-center gap-2 text-gray-600">
                    <MapPin size={16} className="text-[#C26D3A]" />
                    {venue.distance
  ? `${venue.distance.toFixed(1)} km away`
  : "Enable location"}
                  </p>

                  <p className="mt-3 text-sm text-gray-600">
                    {venue.short_description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {venue.attributes.slice(0, 3).map((attribute) => (
                      <span
                        key={attribute}
                        className="rounded-full bg-[#F7F5F2] px-3 py-1 text-sm text-[#1F4D42]"
                      >
                        {attribute}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 font-bold text-[#C26D3A]">
                    View Details →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
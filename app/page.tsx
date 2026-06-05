"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, X } from "lucide-react";

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
  attributes: string[];
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

    return venues.filter((venue) => {
      const matchesFilters =
        selectedFilters.length === 0 ||
        selectedFilters.every((filter) => venue.attributes.includes(filter));

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
  }, [venues, selectedFilters, searchTerm]);

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
          <Image src="/logo.svg" alt="Detour logo" width={150} height={44} priority />

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#explore" className="font-medium hover:text-[#C26D3A]">
              Explore
            </a>
            <a href="#places" className="font-medium hover:text-[#C26D3A]">
              Places
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

            {(searchTerm || selectedFilters.length > 0) && (
              <div className="mt-4 text-sm text-white/80">
                {searchTerm && <p>Showing results for “{searchTerm}”</p>}
                {selectedFilters.length > 0 && (
                  <p>Filters: {selectedFilters.join(", ")}</p>
                )}
              </div>
            )}
          </div>

          <div className="relative min-h-[420px] bg-gradient-to-br from-[#D8C3A5] via-[#6B7D4F] to-[#1F4D42]">
            <div className="absolute bottom-8 left-8 right-8 rounded-3xl bg-white/90 p-6 shadow-xl backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C26D3A]">
                Live Discovery
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#1F4D42]">
                {loading
                  ? "Loading venues..."
                  : `${filteredVenues.length} places found.`}
              </h2>
              <p className="mt-2 text-gray-600">
                Search and filter places by what they offer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#C26D3A]">
                Filter by Attribute
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
                Reset Search
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
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.45fr]">
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold">Discover Places</h2>
              <p className="font-bold text-[#C26D3A]">
                Showing {filteredVenues.length} of {venues.length}
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

            <div className="grid gap-6 md:grid-cols-3">
              {filteredVenues.map((venue) => (
                <Link
                  key={venue.id}
                  href={`/venues/${venue.slug}`}
                  className="block cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:ring-2 hover:ring-[#C26D3A]"
                >
                  <Image
                    src={imageBySlug[venue.slug] || "/venues/boschendal/hero.jpg"}
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
                      Distance coming soon
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
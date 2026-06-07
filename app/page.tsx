"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapPin, MessageCircle } from "lucide-react";

const priorityFilters = [
  "Wine Farm",
  "Coffee Shop",
  "MTB Trail",
  "Hiking Trail",
  "Restaurant",
  "Padel Courts",
  "Child Friendly",
];

const filterLabels: Record<string, string> = {
  "Wine Farm": "🍷 Wine",
  "Coffee Shop": "☕ Coffee",
  "MTB Trail": "🚵 MTB",
  "Hiking Trail": "🥾 Hiking",
  Restaurant: "🍽 Restaurants",
  "Padel Courts": "🎾 Padel",
  "Child Friendly": "👨‍👩‍👧 Family",
};

const promptSuggestions = [
  "Family day out",
  "Wine farms near me",
  "Coffee stop nearby",
  "MTB trails with breakfast",
  "Padel and lunch nearby",
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
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDistanceKm, setAiDistanceKm] = useState<number | null>(null);
  const [aiSearchTerm, setAiSearchTerm] = useState("");
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
    const search = aiSearchTerm.trim().toLowerCase();

    const results = venues.filter((venue) => {
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

      const matchesAiSearch =
        search.length === 0 || searchableText.includes(search);

      return matchesFilters && matchesAiSearch;
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
      .filter((venue) =>
        aiDistanceKm ? (venue.distance ?? 9999) <= aiDistanceKm : true
      )
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [venues, selectedFilters, aiSearchTerm, userLocation, aiDistanceKm]);

  function toggleFilter(filter: string) {
    setSelectedFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter]
    );

    setAiSearchTerm("");
    setAiDistanceKm(null);
  }

  function resetSearch() {
    setSelectedFilters([]);
    setAiDistanceKm(null);
    setAiSearchTerm("");
    setAiQuery("");
  }

  async function askDetour() {
    if (!aiQuery.trim()) return;

    setAiLoading(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: aiQuery }),
      });

      const data = await response.json();

      if (Array.isArray(data.attributes)) {
        setSelectedFilters(data.attributes);
      }

      if (data.searchTerm) {
        setAiSearchTerm(data.searchTerm);
      } else {
        setAiSearchTerm("");
      }

      if (typeof data.distanceKm === "number") {
        setAiDistanceKm(data.distanceKm);

        if (!userLocation) {
          getUserLocation();
        }
      } else {
        setAiDistanceKm(null);
      }
    } catch {
      alert("Ask Detour could not process the request.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] text-[#1E2A28]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-6">
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

      <section id="explore" className="px-4 py-5 md:px-6 md:py-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#0F3F35] px-5 py-7 text-white shadow-2xl md:rounded-[2rem] md:px-12 md:py-10 lg:px-14">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.42fr] lg:items-start">
            <div>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Find your next{" "}
                <span className="text-[#D8C3A5]">detour.</span>
              </h1>

              <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
                Discover wine farms, restaurants, padel venues, trails and
                family experiences near you.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur md:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C26D3A]">
                Live Discovery
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                {loading
                  ? "Loading venues..."
                  : `${filteredVenues.length} places nearby`}
              </h2>

              <button
                onClick={getUserLocation}
                className="mt-4 w-full rounded-full bg-[#C26D3A] px-5 py-3 font-bold text-white md:w-auto"
              >
                {userLocation ? "Location Enabled" : "Use My Location"}
              </button>
            </div>
          </div>

          <div className="mt-7">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#C26D3A]">
              Browse by interest
            </p>

            <div className="flex flex-wrap gap-2.5 md:gap-3">
              {visibleFilters.map((attribute) => {
                const selected = selectedFilters.includes(attribute.name);

                return (
                  <button
                    key={attribute.id}
                    onClick={() => toggleFilter(attribute.name)}
                    className={`rounded-full px-4 py-2.5 text-sm font-bold transition md:px-5 md:py-3 ${
                      selected
                        ? "bg-[#D8C3A5] text-[#0F3F35]"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {selected ? "✓ " : ""}
                    {filterLabels[attribute.name] || attribute.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur md:p-5">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#C26D3A]">
              <MessageCircle size={16} />
              Ask Detour
            </p>

            <div className="flex flex-col gap-3 rounded-3xl bg-white p-3 shadow-xl md:flex-row md:items-center">
              <MessageCircle
                className="hidden text-[#C26D3A] md:block"
                size={24}
              />

              <input
                value={aiQuery}
                onChange={(event) => setAiQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    askDetour();
                  }
                }}
                className="w-full bg-transparent px-2 py-2 text-[#1E2A28] outline-none"
                placeholder="Find a family-friendly wine farm with MTB trails"
              />

              <button
                onClick={askDetour}
                disabled={aiLoading}
                className="rounded-full bg-[#C26D3A] px-6 py-3 font-bold text-white disabled:opacity-60"
              >
                {aiLoading ? "..." : "Ask"}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:flex md:flex-wrap">
              {promptSuggestions.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setAiQuery(prompt)}
                  className="w-full rounded-full bg-white/15 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/25 md:w-auto"
                >
                  {prompt} →
                </button>
              ))}
            </div>
          </div>

          {(selectedFilters.length > 0 || aiSearchTerm || aiDistanceKm) && (
            <div className="mt-5 flex flex-col gap-3 text-sm text-white/80 md:flex-row md:items-center md:justify-between">
              <div>
                {selectedFilters.length > 0 && (
                  <p>Showing: {selectedFilters.join(", ")}</p>
                )}

                {aiSearchTerm && <p>AI search: “{aiSearchTerm}”</p>}

                {aiDistanceKm && <p>Within {aiDistanceKm} km</p>}
              </div>

              <button
                onClick={resetSearch}
                className="w-full rounded-full border border-white/30 px-5 py-2 font-bold text-white md:w-auto"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="places" className="px-4 pb-10 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
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
                Try another chip or ask Detour for something different.
              </p>

              <button
                onClick={resetSearch}
                className="mt-5 rounded-full bg-[#C26D3A] px-6 py-3 font-bold text-white"
              >
                Reset
              </button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

                <div className="p-4 sm:p-6">
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
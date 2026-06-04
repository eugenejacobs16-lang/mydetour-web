"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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

const imageBySlug: Record<string, string> = {
  boschendal: "/venues/boschendal.jpg",
  spier: "/venues/spier.jpg",
  root44: "/venues/root44.jpg",
  babylonstoren: "/venues/boschendal.jpg",
};

type Venue = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  city: string | null;
};

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    async function loadVenues() {
      const response = await fetch("/api/venues");
      const data = await response.json();
      setVenues(data);
    }

    loadVenues();
  }, []);

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
            <div className="absolute bottom-8 left-8 right-8 rounded-3xl bg-white/90 p-6 shadow-xl backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C26D3A]">
                Live Database
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#1F4D42]">
                {venues.length} venues loaded.
              </h2>
              <p className="mt-2 text-gray-600">
                These experiences are coming through the Detour API route.
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
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Image
                    src={imageBySlug[venue.slug] || "/venues/boschendal.jpg"}
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
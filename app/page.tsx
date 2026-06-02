const categories = [
  "Wine Farms",
  "Restaurants",
  "Running",
  "Hiking",
  "MTB",
  "Padel",
  "Family",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F5F2] text-[#1E2A28]">
      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[#2F5D50] p-8 text-white shadow-xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#D8C3A5]">
            Detour
          </p>

          <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-7xl">
            Discover experiences worth stopping for.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-white/80">
            Find wine farms, restaurants, trails, padel spots and family
            experiences near you.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-full bg-[#C26D3A] px-6 py-4 font-bold text-white">
              Use My Location
            </button>

            <button className="rounded-full border border-white/30 px-6 py-4 font-bold text-white">
              Ask Detour
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 pb-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-5 text-2xl font-bold">Explore categories</h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
            {categories.map((category) => (
              <div
                key={category}
                className="rounded-2xl bg-white p-5 text-center font-semibold shadow-sm"
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C26D3A]">
            Coming Soon
          </p>
          <h2 className="mt-2 text-3xl font-bold">Nearby experiences</h2>
          <p className="mt-3 text-gray-600">
            Once connected to Supabase, Detour will show venues near your
            current location, sorted by distance.
          </p>
        </div>
      </section>
    </main>
  );
}
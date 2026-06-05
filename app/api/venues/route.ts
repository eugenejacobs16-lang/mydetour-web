import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET() {
  const { data: venues, error } = await supabase
    .from("venues")
    .select("id, name, slug, short_description, city, latitude, longitude")
    .eq("active", true)
    .order("name");

  if (error || !venues) {
    return NextResponse.json(
      { error: error?.message || "Failed to load venues" },
      { status: 500 }
    );
  }

  const venuesWithAttributes = await Promise.all(
    venues.map(async (venue) => {
      const { data: attributes } = await supabase
        .from("venue_attributes")
        .select("attributes(name)")
        .eq("venue_id", venue.id);

      return {
        ...venue,
        attributes:
          attributes
            ?.map((item: any) => item.attributes?.name)
            .filter(Boolean) || [],
      };
    })
  );

  return NextResponse.json(venuesWithAttributes);
}
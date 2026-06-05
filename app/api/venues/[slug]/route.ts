import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const { data: venue, error: venueError } = await supabase
    .from("venues")
    .select(
      "id,name,slug,short_description,full_description,address,city,website"
    )
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (venueError || !venue) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 });
  }

  const { data: attributes } = await supabase
    .from("venue_attributes")
    .select("attributes(name)")
    .eq("venue_id", venue.id);

  const { data: images } = await supabase
    .from("venue_images")
    .select("storage_path,is_primary,display_order")
    .eq("venue_id", venue.id)
    .order("display_order");

  return NextResponse.json({
    ...venue,
    attributes:
      attributes?.map((a: any) => a.attributes?.name).filter(Boolean) || [],
    images: images || [],
  });
}
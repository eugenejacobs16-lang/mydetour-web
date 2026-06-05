import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

const DETOUR_ATTRIBUTES = [
  "Wine Farm",
  "Restaurant",
  "Coffee Shop",
  "Child Friendly",
  "MTB Trail",
  "Hiking Trail",
  "Running Trail",
  "Padel Courts",
  "Wine Tasting",
  "Parking",
  "Scenic Views",
];

export async function POST(request: Request) {
  const { query } = await request.json();

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-v4-flash",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are Detour's search interpreter.

Convert the user's request into matching Detour attributes.

Only return valid JSON.

Available attributes:
${DETOUR_ATTRIBUTES.join(", ")}

Return format:
{
  "attributes": ["Wine Farm", "Child Friendly"],
  "searchTerm": "",
  "distanceKm": null
}

Rules:
- Only use attributes from the available list.
- If user mentions a venue name, put it in searchTerm.
- If unsure, return an empty attributes array.
- If the user mentions distance like "within 20km", return distanceKm as a number.
- If no distance is mentioned, return distanceKm as null.
`,
        },
        {
          role: "user",
          content: query,
        },
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "DeepSeek request failed" },
      { status: 500 }
    );
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch {
    return NextResponse.json(
      { error: "Could not parse AI response" },
      { status: 500 }
    );
  }

  const attributes = Array.isArray(parsed.attributes)
    ? parsed.attributes.filter((attribute: string) =>
        DETOUR_ATTRIBUTES.includes(attribute)
      )
    : [];

  const searchTerm =
    typeof parsed.searchTerm === "string" ? parsed.searchTerm : "";

    const distanceKm =
  typeof parsed.distanceKm === "number" ? parsed.distanceKm : null;

  return NextResponse.json({
  attributes,
  searchTerm,
  distanceKm,
});
}
import { APP } from "$lib/const/app.const";
import type { Branded } from "$lib/interfaces/zod/zod.types";
import type { Artist } from "$lib/server/db/models/artist.model";
import { App } from "../app";

// SOURCE: https://chatgpt.com/c/693d6f4c-2d30-832c-8b9f-1f4f5fc967d0
const normalise_name = (input: string) =>
  input
    .normalize("NFKD") // 1. split accents
    .replace(/[\u0300-\u036f]/g, "") // 2. remove diacritics
    .toLowerCase() // 3. lowercase
    .replace(/[^a-z0-9\s]/g, "") // 4. remove punctuation
    // 5. remove all whitespace
    .replace(/\s+/g, "") as Branded<"NormalizedName">;

const share_data = (artist: Pick<Artist, "name" | "slug">): ShareData => ({
  title: artist.name,
  text: "Check out this artist on " + APP.NAME,
  // NOTE: Don't use `resolve` here, it adds a base route which breaks things
  url: App.full_url(`/artist/${artist.slug}`).toString(),
});

export const ArtistUtil = {
  normalise_name,
  share_data,
};

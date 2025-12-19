import type { Branded } from "$lib/interfaces/zod/zod.types";

// SOURCE: https://chatgpt.com/c/693d6f4c-2d30-832c-8b9f-1f4f5fc967d0
const normalise_name = (input: string) =>
  input
    .normalize("NFKD") // 1. split accents
    .replace(/[\u0300-\u036f]/g, "") // 2. remove diacritics
    .toLowerCase() // 3. lowercase
    .replace(/[^a-z0-9\s]/g, "") // 4. remove punctuation
    // 5. remove all whitespace
    .replace(/\s+/g, "") as Branded<"NormalizedName">;

export const ArtistUtil = {
  normalise_name,
};

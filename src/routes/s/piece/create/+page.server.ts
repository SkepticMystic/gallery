import { get_session } from "$lib/services/auth.service";
import type { PageServerLoad } from "./$types";

export const load = (async ({ url }) => {
  await get_session();

  const search = {
    gallery_id: url.searchParams.get("gallery_id") ?? undefined,
  };

  return {
    search,
  };
}) satisfies PageServerLoad;

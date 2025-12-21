import {
  admin_approve_artist_remote,
  admin_delete_artist_remote,
} from "$lib/remote/artist/artist.remote";
import { Client } from "../index.client";

export const ArtistClient = {
  admin_delete: Client.wrap(
    (artist_id: string) => admin_delete_artist_remote(artist_id),
    { confirm: "Are you sure you want to delete this artist?" },
  ),

  admin_approve: Client.wrap(
    (input: Parameters<typeof admin_approve_artist_remote>[0]) =>
      admin_approve_artist_remote(input),
  ),
};

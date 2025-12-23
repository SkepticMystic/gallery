import {
  admin_delete_artist_remote,
  toggle_artist_approved_remote,
} from "$lib/remote/artist/artist.remote";
import { Client } from "../index.client";

export const ArtistClient = {
  admin_delete: Client.wrap(
    (artist_id: string) => admin_delete_artist_remote(artist_id),
    { confirm: "Are you sure you want to delete this artist?" },
  ),

  toggle_approved: Client.wrap((artist_id: string) =>
    toggle_artist_approved_remote(artist_id),
  ),
};

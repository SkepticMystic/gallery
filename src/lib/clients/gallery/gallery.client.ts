import { delete_gallery_by_id_remote } from "$lib/remote/gallery/gallery.remote";
import { Client } from "../index.client";

export const GalleryClient = {
  delete: Client.wrap(
    (input: Parameters<typeof delete_gallery_by_id_remote>[0]) =>
      delete_gallery_by_id_remote(input),
    {
      confirm: "Are you sure you want to delete this gallery?",
    },
  ),
};

import {
  admin_delete_gallery_remote,
  delete_gallery_by_id_remote,
  toggle_gallery_approved_remote,
} from "$lib/remote/gallery/gallery.remote";
import { Client } from "../index.client";

export const GalleryClient = {
  delete: Client.wrap(
    (input: Parameters<typeof delete_gallery_by_id_remote>[0]) =>
      delete_gallery_by_id_remote(input),
    {
      confirm: "Are you sure you want to delete this gallery?",
    },
  ),

  admin_delete: Client.wrap(
    (gallery_id: string) => admin_delete_gallery_remote(gallery_id),
    {
      confirm: "Are you sure you want to delete this gallery?",
    },
  ),

  toggle_approved: Client.wrap((gallery_id: string) =>
    toggle_gallery_approved_remote(gallery_id),
  ),
};

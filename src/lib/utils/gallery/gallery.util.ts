import { APP } from "$lib/const/app.const";
import type { Gallery } from "$lib/server/db/models/gallery.model";
import { App } from "../app";

export const GalleryUtil = {
  share_data: (gallery: Pick<Gallery, "name" | "slug">): ShareData => ({
    title: gallery.name,
    text: "Checkout this gallery on " + APP.NAME,
    // NOTE: Don't use `resolve` here, it adds a base route which breaks things
    url: App.full_url(`/gallery/${gallery.slug}`).toString(),
  }),
};

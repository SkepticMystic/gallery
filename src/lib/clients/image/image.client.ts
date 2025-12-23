import { thumbHashToDataURL } from "thumbhash";
import {
  admin_delete_image_remote,
  toggle_image_approved_remote,
  delete_image_remote,
} from "../../remote/image/image.remote";
import type { Image } from "../../server/db/models/image.model";
import { Client } from "../index.client";

export const ImageClient = {
  delete: Client.wrap((image_id: string) => delete_image_remote(image_id), {
    confirm:
      "Are you sure you want to delete this image? This action cannot be undone.",
    suc_msg: "Image deleted",
  }),

  admin_delete: Client.wrap(
    (image_id: string) => admin_delete_image_remote(image_id),
    {
      confirm: "Are you sure you want to delete this image?",
    },
  ),

  // SOURCE: https://github.com/evanw/thumbhash/blob/main/examples/browser/index.html
  decode_thumbhash: (image?: Pick<Image, "thumbhash">) =>
    image?.thumbhash
      ? thumbHashToDataURL(
          new Uint8Array(
            atob(image.thumbhash)
              .split("")
              .map((x) => x.charCodeAt(0)),
          ),
        )
      : undefined,

  toggle_approved: Client.wrap((image_id: string) =>
    toggle_image_approved_remote(image_id),
  ),
};

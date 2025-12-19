import { APP } from "$lib/const/app.const";
import type { Piece } from "$lib/server/db/models/piece.model";
import { App } from "../app";

export const PieceUtil = {
  format_dimensions: (
    piece: Pick<Piece, "width_cm" | "height_cm" | "depth_cm">,
  ) => {
    const s = [piece.width_cm, piece.height_cm, piece.depth_cm]
      .filter(Boolean)
      .join(" x ");

    return s ? s + " cm" : "";
  },

  share_data: (piece: Pick<Piece, "name" | "slug">): ShareData => ({
    title: piece.name,
    text: "Checkout this piece on " + APP.NAME,
    // NOTE: Don't use `resolve` here, it adds a base route which breaks things
    url: App.full_url(`/piece/${piece.slug}`).toString(),
  }),
};

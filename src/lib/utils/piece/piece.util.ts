import type { Piece } from "$lib/server/db/models/piece.model";

export const PieceUtil = {
  format_dimensions: (
    piece: Pick<Piece, "width_cm" | "height_cm" | "depth_cm">,
  ) =>
    [piece.width_cm, piece.height_cm, piece.depth_cm]
      .filter(Boolean)
      .join(" x ") + " cm",
};

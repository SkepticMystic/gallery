import { delete_piece_by_id_remote } from "$lib/remote/piece/piece.remote";
import { Client } from "../index.client";

export const PieceClient = {
  delete: Client.wrap(
    (input: Parameters<typeof delete_piece_by_id_remote>[0]) =>
      delete_piece_by_id_remote(input),
    {
      confirm: "Are you sure you want to delete this piece?",
    },
  ),
};

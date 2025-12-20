const PIECE_STATUS_IDS = [
  "available",
  "pending",
  "sold",
  "not_for_sale",
  "archived",
] as const;

export const PIECE = {
  STATUS: {
    IDS: PIECE_STATUS_IDS,
    MAP: {
      available: { label: "Available" },
      pending: { label: "Pending" },
      sold: { label: "Sold" },
      not_for_sale: { label: "Not for sale" },
      archived: { label: "Archived" },
    } satisfies Record<(typeof PIECE_STATUS_IDS)[number], { label: string }>,
  },
};

/** Represents the tables users can interact with */

const KIND_IDS = ["gallery", "piece", "artist"] as const;
export type ResourceKind = (typeof KIND_IDS)[number];

const KIND_MAP = {
  gallery: { label: "Gallery" },
  piece: { label: "Piece" },
  artist: { label: "Artist" },
} satisfies Record<ResourceKind, { label: string }>;

export const RESOURCES = {
  KIND: {
    IDS: KIND_IDS,
    MAP: KIND_MAP,
  },
};

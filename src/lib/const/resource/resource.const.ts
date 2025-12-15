/** Represents the tables users can interact with */

const KIND_IDS = ["gallery"] as const;
export type ResourceKind = (typeof KIND_IDS)[number];

const KIND_MAP = {
  gallery: { label: "Gallery" },
} satisfies Record<ResourceKind, { label: string }>;

export const RESOURCES = {
  KIND: {
    IDS: KIND_IDS,
    MAP: KIND_MAP,
  },
};

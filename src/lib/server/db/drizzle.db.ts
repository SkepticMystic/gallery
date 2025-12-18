import { DATABASE_URL } from "$env/static/private";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as AuthModels from "./models/auth.model";
import * as GalleryModel from "./models/gallery.model";
import * as ImageModel from "./models/image.model";
import * as PieceModel from "./models/piece.model";
import * as SubscriptionModel from "./models/subscription.model";

const client = neon(DATABASE_URL);

const {
  AccountTable,
  InvitationTable,
  MemberTable,
  OrganizationTable,
  PasskeyTable,
  SessionTable,
  UserTable,
  VerificationTable,
  TwoFactorTable,
  ...auth_rest
} = AuthModels;

const { SubscriptionTable, ...subscription_rest } = SubscriptionModel;

const { ImageTable, ...image_rest } = ImageModel;

const { GalleryTable, ...gallery_rest } = GalleryModel;

const { PieceTable, ...piece_rest } = PieceModel;

export const db = drizzle(client, {
  casing: "snake_case",
  schema: {
    // Auth
    user: UserTable,
    account: AccountTable,
    session: SessionTable,
    verification: VerificationTable,
    organization: OrganizationTable,
    member: MemberTable,
    invitation: InvitationTable,
    passkey: PasskeyTable,
    twoFactor: TwoFactorTable,
    ...auth_rest,

    // Subscription
    subscription: SubscriptionTable,
    ...subscription_rest,

    // Image
    image: ImageTable,
    ...image_rest,

    // Gallery
    gallery: GalleryTable,
    ...gallery_rest,

    // Piece
    piece: PieceTable,
    ...piece_rest,
  },
});

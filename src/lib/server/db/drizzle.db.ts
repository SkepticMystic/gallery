import { DATABASE_URL } from "$env/static/private";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as ArtistModel from "./models/artist.model";
import * as AuthModels from "./models/auth.model";
import * as GalleryModel from "./models/gallery.model";
import * as ImageModel from "./models/image.model";
import * as PageViewModel from "./models/page_view.model";
import * as PieceModel from "./models/piece.model";

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

const { ImageTable, ...image_rest } = ImageModel;

const { GalleryTable, ...gallery_rest } = GalleryModel;

const { PieceTable, ...piece_rest } = PieceModel;

const { ArtistTable, ...artist_rest } = ArtistModel;

const { PageViewTable, ...page_view_rest } = PageViewModel;

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

    // Image
    image: ImageTable,
    ...image_rest,

    // Gallery
    gallery: GalleryTable,
    ...gallery_rest,

    // Piece
    piece: PieceTable,
    ...piece_rest,

    // Artist
    artist: ArtistTable,
    ...artist_rest,

    // PageView
    page_view: PageViewTable,
    ...page_view_rest,
  },
});

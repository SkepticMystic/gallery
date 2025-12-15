import { captureException } from "@sentry/sveltekit";
import { and, count, DrizzleQueryError, eq } from "drizzle-orm";
import { ERROR } from "../../../const/error.const";
import { Log } from "../../../utils/logger.util";
import { result } from "../../../utils/result.util";
import { db } from "../drizzle.db";
import { ImageTable, type Image } from "../models/image.model";
import { Repo } from "./index.repo";

const build_image_where_clause = (
  input: Partial<Pick<Image, "id" | "resource_id" | "resource_kind">> & {
    org_id: string;
  },
) =>
  and(
    eq(ImageTable.org_id, input.org_id),

    input.id //
      ? eq(ImageTable.id, input.id)
      : undefined,
    input.resource_id
      ? eq(ImageTable.resource_id, input.resource_id)
      : undefined,
    input.resource_kind
      ? eq(ImageTable.resource_kind, input.resource_kind)
      : undefined,
  );

const create = async (input: typeof ImageTable.$inferInsert) => {
  const image = await Repo.insert_one(
    db.insert(ImageTable).values(input).returning(),
  );

  return image;
};

const count_images = async (
  input: Pick<Image, "resource_id" | "resource_kind" | "org_id">,
) => {
  const existing_images = await Repo.query(
    db
      .select({ count: count(ImageTable.id) })
      .from(ImageTable)
      .where(build_image_where_clause(input))
      .groupBy(ImageTable.resource_id),
  );

  if (!existing_images.ok) {
    return existing_images;
  } else {
    return result.suc(existing_images.data.at(0)?.count ?? 0);
  }
};

const delete_many = async (
  input: Partial<Pick<Image, "id" | "resource_id" | "resource_kind">> & {
    org_id: string;
  },
) => {
  const where = build_image_where_clause(input);

  const images = await db //
    .delete(ImageTable)
    .where(where)
    .returning();

  return result.suc(images);
};

const set_admin_approved = async (input: {
  id: string;
  admin_approved: boolean;
}): Promise<App.Result<Image>> => {
  try {
    const res = await Repo.update_one(
      db
        .update(ImageTable)
        .set({ admin_approved: input.admin_approved })
        .where(eq(ImageTable.id, input.id))
        .returning(),
    );

    return res;
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "ImageRepo.set_admin_approved.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(ERROR.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "ImageRepo.set_admin_approved.error unknown");

      captureException(error);

      return result.err(ERROR.INTERNAL_SERVER_ERROR);
    }
  }
};

export const ImageRepo = {
  create,
  count: count_images,
  delete_many,

  set_admin_approved,
};

import { ERROR } from "$lib/const/error.const";
import type { ResourceKey } from "$lib/schema/resource/resource.schema";
import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { Log } from "../../utils/logger.util";
import { result } from "../../utils/result.util";

// WARN: Does not check org_id!
const get_by_key = async (input: ResourceKey) => {
  switch (input.resource_kind) {
    case "gallery": {
      const res = await Repo.query(
        db.query.gallery.findFirst({
          columns: { id: true, org_id: true, name: true, slug: true },
          where: (res, { eq }) => eq(res.id, input.resource_id),
        }),
      );

      if (!res.ok) {
        return res;
      } else {
        return res.data ? result.suc(res.data) : result.err(ERROR.NOT_FOUND);
      }
    }

    case "piece": {
      const res = await Repo.query(
        db.query.piece.findFirst({
          columns: { id: true, org_id: true, name: true, slug: true },
          where: (res, { eq }) => eq(res.id, input.resource_id),
        }),
      );

      if (!res.ok) {
        return res;
      } else {
        return res.data ? result.suc(res.data) : result.err(ERROR.NOT_FOUND);
      }
    }

    default: {
      Log.error(`Unsupported image resource kind: ${input.resource_kind}`);

      return result.err({
        status: 500,
        message: "Unsupported image resource kind",
      });
    }
  }
};

export const ResourceService = {
  get_by_key,
};

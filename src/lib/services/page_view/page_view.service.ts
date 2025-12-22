import { getRequestEvent } from "$app/server";
import { ERROR } from "$lib/const/error.const";
import type { ResourceKey } from "$lib/schema/resource/resource.schema";
import { db } from "$lib/server/db/drizzle.db";
import { PageViewTable } from "$lib/server/db/models/page_view.model";
import { Repo } from "$lib/server/db/repos/index.repo";
import { PageViewRepo } from "$lib/server/db/repos/page_view.repo";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { and, count, eq } from "drizzle-orm";
import { safe_get_session } from "../auth.service";
import { ResourceService } from "../resource/resource.service";

const count_by_resource = async (where: ResourceKey & { org_id: string }) => {
  try {
    const res = await Repo.query(
      db
        .select({ count: count(PageViewTable.id) })
        .from(PageViewTable)
        .where(
          and(
            eq(PageViewTable.org_id, where.org_id),
            eq(PageViewTable.resource_id, where.resource_id),
            eq(PageViewTable.resource_kind, where.resource_kind),
          ),
        ),
    );

    return res.ok ? (res.data.at(0)?.count ?? 0) : 0;
  } catch (error) {
    Log.error(error, "PageViewService.count_by_resource.error unknown");

    captureException(error);

    return 0;
  }
};

const create = async (
  input: Pick<
    typeof PageViewTable.$inferInsert,
    "resource_id" | "resource_kind"
  >,
): Promise<App.Result<null>> => {
  try {
    const event = getRequestEvent();

    const [session, resource] = await Promise.all([
      safe_get_session(),

      ResourceService.get_by_key(input),
    ]);
    if (!resource.ok) {
      return resource;
    } else if (!resource.data) {
      return result.err(ERROR.NOT_FOUND);
    }

    const res = await PageViewRepo.insert_one({
      ...input,
      url: event.request.url,
      ip_address: event.getClientAddress(),
      user_agent: event.request.headers.get("user-agent"),

      org_id: resource.data.org_id,
      viewer_user_id: session?.session.userId,
    });

    if (!res.ok && res.error.code === "DUPLICATE") {
      return result.suc(null);
    } else {
      return res.ok ? result.suc(null) : res;
    }
  } catch (error) {
    Log.error(error, "PageViewService.create.error unknown");

    captureException(error);

    return result.err(ERROR.INTERNAL_SERVER_ERROR);
  }
};

export const PageViewService = {
  create,
  count_by_resource,
};

import { getRequestEvent } from "$app/server";
import { ERROR } from "$lib/const/error.const";
import { PageViewTable } from "$lib/server/db/models/page_view.model";
import { PageViewRepo } from "$lib/server/db/repos/page_view.repo";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { safe_get_session } from "../auth.service";

const create = async (
  input: Pick<typeof PageViewTable.$inferInsert, "page_key">,
): Promise<App.Result<null>> => {
  try {
    const event = getRequestEvent();

    const session = await safe_get_session();

    const res = await PageViewRepo.insert_one({
      ...input,
      url: event.request.url,
      ip_address: event.getClientAddress(),
      user_agent: event.request.headers.get("user-agent"),

      user_id: session?.session.userId,
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
};

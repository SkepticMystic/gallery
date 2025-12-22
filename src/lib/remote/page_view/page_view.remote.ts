import { query } from "$app/server";
import { resource_key_schema } from "$lib/schema/resource/resource.schema";
import { get_seller_session } from "$lib/services/auth.service";
import { PageViewService } from "$lib/services/page_view/page_view.service";

export const count_my_page_views_by_resource_remote = query(
  resource_key_schema,
  async (input) => {
    const { session } = await get_seller_session();

    const res = await PageViewService.count_by_resource({
      ...input,
      org_id: session.org_id,
    });

    return res;
  },
);

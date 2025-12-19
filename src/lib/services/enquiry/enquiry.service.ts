import { EMAIL } from "$lib/const/email.const";
import { ERROR } from "$lib/const/error.const";
import { db } from "$lib/server/db/drizzle.db";
import type {
  Enquiry,
  EnquirySchema,
} from "$lib/server/db/models/enquiry.model";
import { EnquiryRepo } from "$lib/server/db/repos/enquiry.repo";
import { Repo } from "$lib/server/db/repos/index.repo";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { safe_get_session } from "../auth.service";
import { EmailService } from "../email.service";
import { ResourceService } from "../resource/resource.service";

const create = async (
  input: EnquirySchema["insert"],
): Promise<App.Result<Enquiry>> => {
  try {
    const [session, resource] = await Promise.all([
      safe_get_session(),

      ResourceService.get_by_kind_and_id({
        resource_id: input.resource_id,
        resource_kind: input.resource_kind,
      }),
    ]);
    if (!resource.ok) {
      return resource;
    } else if (!resource.data) {
      return result.err(ERROR.NOT_FOUND);
    }

    const owner = await Repo.query(
      db.query.member.findFirst({
        columns: {},
        with: { user: { columns: { name: true, email: true } } },

        where: (member, { eq, and }) =>
          and(
            eq(member.role, "owner"),
            eq(member.organizationId, resource.data.org_id),
          ),
      }),
    );
    if (!owner.ok) {
      return owner;
    } else if (!owner.data) {
      return result.err(ERROR.NOT_FOUND);
    }

    const enquiry = await EnquiryRepo.insert_one({
      ...input,
      org_id: resource.data.org_id,
      created_by_user_id: session?.user.id,
    });

    if (!enquiry.ok) {
      return enquiry;
    }

    await EmailService.send(
      EMAIL.TEMPLATES["enquiry-submitted"]({
        enquiry: enquiry.data,
        owner: owner.data.user,
        resource: resource.data,
      }),
    );

    return enquiry;
  } catch (error) {
    Log.error(error, "EnquiryService.create.error unknown");

    captureException(error);

    return result.err(ERROR.INTERNAL_SERVER_ERROR);
  }
};

export const EnquiryService = {
  create,
};

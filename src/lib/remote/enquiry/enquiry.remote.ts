import { form } from "$app/server";
import { EnquirySchema } from "$lib/server/db/models/enquiry.model";
import { EnquiryService } from "$lib/services/enquiry/enquiry.service";

export const create_enquiry_remote = form(
  EnquirySchema.insert, //
  async (input) => {
    const res = await EnquiryService.create(input);

    return res;
  },
);

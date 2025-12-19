import { form, getRequestEvent } from "$app/server";
import { auth } from "$lib/auth";
import { ERROR } from "$lib/const/error.const";
import { PAYSTACK } from "$lib/const/payment/paystack/paystack.payment.const";
import { get_session } from "$lib/services/auth.service";
import { App } from "$lib/utils/app";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { APIError } from "better-auth";
import z from "zod";

export const paystack_initialize_transaction_remote = form(
  z.object({
    plan: z.enum(PAYSTACK.PLANS.IDS),
  }),
  async (input) => {
    Log.info(input, "paystack_initialize_transaction_remote");

    const { session } = await get_session();

    try {
      const res = await auth.api.initializeTransaction({
        headers: getRequestEvent().request.headers,
        body: {
          amount: 10000,
          plan: input.plan,
          referenceId: session.org_id,
          callbackURL: App.full_url("/plan").toString(),
        },
      });

      Log.info(res, "paystack_initialize_transaction_remote.res");

      if (!res.ok) {
        return res;
      } else {
        return result.suc({ redirect_url: res.data.data.authorization_url });
      }
    } catch (error) {
      if (error instanceof APIError) {
        Log.info(
          error,
          "paystack_initialize_transaction_remote.error better-auth",
        );

        captureException(error);

        return result.err({ message: error.message });
      } else {
        Log.error(
          error,
          "paystack_initialize_transaction_remote.error unknown",
        );

        captureException(error);

        return result.err(ERROR.INTERNAL_SERVER_ERROR);
      }
    }
  },
);

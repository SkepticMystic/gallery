import { BetterAuthClient } from "$lib/auth-client";
import { type PaystackPlanName } from "$lib/const/payment/paystack/paystack.payment.const";
import { App } from "$lib/utils/app";
import { Client } from "../index.client";

export const SubscriptionClient = {
  subscribe: Client.better_auth(async (input: { plan: PaystackPlanName }) => {
    const res = await BetterAuthClient.paystack.transaction.initialize({
      plan: input.plan,
      callbackURL: App.full_url("/plan").toString(),
    });

    return res;
  }),
};

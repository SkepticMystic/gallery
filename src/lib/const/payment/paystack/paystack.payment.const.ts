import type { PaystackPlan } from "@alexasomba/better-auth-paystack";

const PLAN_NAMES = ["starter"] as const;
export type PaystackPlanName = (typeof PLAN_NAMES)[number];

export const PAYSTACK = {
  PLANS: {
    IDS: PLAN_NAMES,
    LIST: [
      {
        interval: "monthly",
        freeTrial: { days: 14 },
        planCode: "PLN_912yjmwpzgdzzy2",
        name: "starter" satisfies PaystackPlanName,
      },
    ] as const satisfies PaystackPlan[],
  },
};

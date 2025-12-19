import { PAYSTACK_SECRET_KEY } from "$env/static/private";
import { Paystack } from "paystack-sdk";

export const PaystackSDK = new Paystack(PAYSTACK_SECRET_KEY);

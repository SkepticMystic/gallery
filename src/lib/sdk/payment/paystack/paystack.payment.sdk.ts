import { PAYSTACK_SECRET_KEY } from "$env/static/private";
import SDK from "paystack-sdk";

export const PaystackSDK = new SDK(PAYSTACK_SECRET_KEY);

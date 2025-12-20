import { asset } from "$app/paths";
import { PUBLIC_BASE_URL } from "$env/static/public";

export const APP = {
  // NOTE: Intention is that this never changes
  // Currently used to add a fixed key prefix to Redis keys
  ID: "gallery",
  NAME: "Gallery",
  URL: PUBLIC_BASE_URL,
  LOGO: asset("/favicon.svg"),
  DOMAIN: new URL(PUBLIC_BASE_URL).hostname,
  DESCRIPTION: "Find and share art that you love",
};

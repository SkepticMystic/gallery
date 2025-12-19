import { captureException } from "@sentry/sveltekit";

const add_search = (
  url: URL,
  search: URLSearchParams | Record<string, unknown>,
) => {
  const resolved =
    search instanceof URLSearchParams ? Object.fromEntries(search) : search;

  for (const key in resolved) {
    if (resolved[key] === undefined) continue;

    url.searchParams.set(key, String(resolved[key]));
  }

  return url;
};

const build = (
  base: string,
  path: string,
  search?: URLSearchParams | Record<string, unknown>,
) => {
  try {
    const url = new URL(base + path);

    if (search) {
      add_search(url, search);
    }

    return url;
  } catch (error) {
    console.error("Url.build.error", { base, path, search }, error);

    captureException(error);

    throw error;
  }
};

const safe = (url: string | URL) => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

const format = (href: string) => {
  const url = safe(href);
  if (!url) return href;

  return url.host.split("www.").at(-1) || url.host;
};

export const Url = {
  safe,
  build,
  format,
  add_search,

  strip_origin: (url: URL) => url.pathname + url.search + url.hash,
};

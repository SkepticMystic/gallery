import { APP } from "$lib/const/app.const";
import { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
import type { Image } from "$lib/server/db/models/image.model";
import { deepMerge } from "svelte-meta-tags";
import { transformUrl } from "unpic";
import { Markdown } from "../markdown/markdown.util";
import { Url } from "../urls";

type UTMData = {
  /**
   * Identifies the source of the traffic, such as a search engine or newsletter.
   * utm_source=google
   */
  source?: string;
  /**
   * Identifies search terms.
   * utm_term=running+shoes */
  term?: string;
  /**
   * Identifies what type of link was used, such as email or pay-per-click advertising.
   * utm_medium=ppc
   */
  medium?: string;
  /**
   * Identifies what specifically was clicked to bring the user to the site, such as a banner ad or a text link. It is often used for A/B testing and content-targeted ads.
   * utm_content=textlink
   */
  content?: string;
  /**
   * Identifies a specific product promotion or strategic campaign.
   * utm_campaign=spring_sale
   */
  campaign?: string;
};

const utmify = (href: string, params: UTMData) => {
  const url = Url.safe(href);
  if (!url) return href;

  const resolved = {
    utm_term: params.term,
    utm_medium: params.medium,
    utm_content: params.content,
    utm_campaign: params.campaign,
    utm_source: params.source ?? APP.DOMAIN,
  };

  return Url.add_search(url, resolved).toString();
};

const transform = (
  input: NonNullable<App.PageData["seo"]>,
): NonNullable<App.PageData["seo"]> => {
  const title = input.title?.trim();

  const description = input.description
    ? Markdown.strip(input.description).trim().slice(0, 160)
    : undefined;

  const images = input.openGraph?.images?.map((img) => ({
    ...img,

    url:
      transformUrl({
        url: img.url,
        format: "auto",
        quality: "auto",
        width: img.width,
        height: img.height,
        provider: IMAGE_HOSTING.PROVIDER.CURRENT,
      }) || img.url,
  }));

  return Object.freeze({
    title,
    description,

    twitter: {
      ...input.twitter,

      title,
      description,
      image: input.twitter?.image || images?.at(0)?.url,
    },

    openGraph: {
      ...input.openGraph,

      title,
      images,
      description,
    },
  });
};

const from_resource = (
  resource: {
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;

    images: Pick<Image, "url" | "width" | "height">[];
  },
  extra?: NonNullable<App.PageData["seo"]>,
) => {
  return transform(
    deepMerge(
      {
        title: resource.name,
        description: resource.description,

        openGraph: {
          images: resource.images.map((image) => ({
            url: image.url,
            secureUrl: image.url,
            // type?: string;
            width: image.width,
            height: image.height,
            alt: resource.name,
          })),

          article: {
            modifiedTime: resource.updatedAt.toISOString(),
            publishedTime: resource.createdAt.toISOString(),
          },
        },
      },
      extra,
    ),
  );
};

export const SEOUtil = {
  utmify,
  transform,
  from_resource,
};

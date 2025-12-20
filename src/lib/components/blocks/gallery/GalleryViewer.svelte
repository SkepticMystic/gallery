<script lang="ts">
  import Picture from "$lib/components/image/Picture.svelte";
  import GoogleMapIFrame from "$lib/components/map/GoogleMapIFrame.svelte";
  import PrerenderedMarkdown from "$lib/components/text/markdown/PrerenderedMarkdown.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import type { Gallery } from "$lib/server/db/models/gallery.model";
  import type { Image } from "$lib/server/db/models/image.model";
  import type { IHTML } from "$lib/utils/html/html.util";
  import { Url } from "$lib/utils/urls";
  import { parsePhoneNumberFromString as parse_phone_number } from "libphonenumber-js/min";

  let {
    gallery,
    prerendered,
  }: {
    gallery: Pick<
      Gallery,
      | "name"
      | "slug"
      | "logo"
      | "urls"
      | "phones"
      | "emails"
      | "google_place_id"
      | "formatted_address"
      | "updatedAt"
    > & {
      images: Pick<Image, "url" | "thumbhash">[];
    };

    prerendered: {
      description: IHTML.Prerendered | null;
    };
  } = $props();
</script>

{#if gallery.images.length}
  <section id="images">
    <h2 class="sr-only">Images</h2>

    <div class="flex flex-wrap gap-2">
      {#each gallery.images as image, i (image.url)}
        <Picture
          {image}
          width={200}
          height={200}
          prioritize={i === 0}
        />
      {/each}
    </div>
  </section>
{/if}

<section id="info">
  <h2 class="sr-only">Info</h2>

  <address class="flex flex-wrap justify-between gap-2">
    {#if gallery.urls.length > 0}
      <div class="flex flex-col gap-1">
        {#each gallery.urls as { data, label } (data)}
          <Anchor
            href={data}
            target="_blank"
            icon="lucide/globe"
            rel="noopener noreferrer"
          >
            {label || Url.format(data)}
          </Anchor>
        {/each}
      </div>
    {/if}

    {#if gallery.emails.length > 0}
      <div class="flex flex-col gap-1">
        {#each gallery.emails as { data, label } (data)}
          <Anchor
            icon="lucide/mail"
            href="mailto:{data}"
          >
            {label || data}
          </Anchor>
        {/each}
      </div>
    {/if}

    {#if gallery.phones.length > 0}
      <div class="flex flex-col gap-1">
        {#each gallery.phones as { data, label } (data)}
          <Anchor
            icon="lucide/phone"
            href="tel:{data}"
          >
            {label || parse_phone_number(data)?.formatNational() || data}
          </Anchor>
        {/each}
      </div>
    {/if}
  </address>
</section>

{#if prerendered.description}
  {@const html = prerendered.description}

  <section id="description">
    <h2 class="sr-only">Description</h2>

    <Card title="Description">
      {#snippet content()}
        <PrerenderedMarkdown {html} />
      {/snippet}
    </Card>
  </section>
{/if}

{#if gallery.google_place_id}
  <section id="location">
    <h2 class="sr-only">Location</h2>

    <GoogleMapIFrame
      google_place_id={gallery.google_place_id}
      formatted_address={gallery.formatted_address}
    />
  </section>
{/if}

<footer id="meta">
  <h2 class="sr-only">Meta</h2>

  <p class="text-sm text-muted-foreground">
    Last updated: {gallery.updatedAt.toLocaleString()}
  </p>
</footer>

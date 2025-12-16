<script lang="ts">
  import Picture from "$lib/components/image/Picture.svelte";
  import GoogleMapIFrame from "$lib/components/map/GoogleMapIFrame.svelte";
  import PrerenderedMarkdown from "$lib/components/text/markdown/PrerenderedMarkdown.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import type { Gallery } from "$lib/server/db/models/gallery.model";
  import type { Image } from "$lib/server/db/models/image.model";
  import type { IHTML } from "$lib/utils/html/html.util";

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
      | "coord_lat"
      | "coord_lng"
    > & {
      images: Pick<Image, "url" | "thumbhash">[];
    };

    prerendered: {
      description: IHTML.Prerendered | null;
    };
  } = $props();
</script>

{#if gallery.logo}
  <section id="logo">
    <img
      src={gallery.logo}
      alt="{gallery.name} logo"
      class="h-24 w-auto object-contain"
    />
  </section>
{/if}

{#if gallery.images.length}
  <section id="images">
    <div class="flex flex-wrap gap-2">
      {#each gallery.images as image (image.url)}
        <Picture
          {image}
          width={200}
          height={200}
        />
      {/each}
    </div>
  </section>
{/if}

<section id="info">
  {#if gallery.urls.length > 0}
    <div class="flex flex-col gap-1">
      {#each gallery.urls as { data, label } (data)}
        <Anchor
          href={data}
          target="_blank"
          icon="lucide/globe"
          rel="noopener noreferrer"
        >
          {label || data.split("://")[1]}
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
          {label || data}
        </Anchor>
      {/each}
    </div>
  {/if}
</section>

{#if prerendered.description}
  <section id="description">
    <PrerenderedMarkdown html={prerendered.description} />
  </section>
{/if}

{#if gallery.google_place_id}
  <section id="map">
    <GoogleMapIFrame
      google_place_id={gallery.google_place_id}
      formatted_address={gallery.formatted_address}
    />
  </section>
{/if}

<script lang="ts">
  import { resolve } from "$app/paths";
  import Picture from "$lib/components/image/Picture.svelte";
  import PrerenderedMarkdown from "$lib/components/text/markdown/PrerenderedMarkdown.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import type { Gallery } from "$lib/server/db/models/gallery.model";
  import type { Image } from "$lib/server/db/models/image.model";
  import type { Piece } from "$lib/server/db/models/piece.model";
  import { Format } from "$lib/utils/format.util.js";
  import type { IHTML } from "$lib/utils/html/html.util";
  import { PieceUtil } from "$lib/utils/piece/piece.util.js";

  let {
    piece,
    prerendered,
  }: {
    piece: Pick<
      Piece,
      | "name"
      | "slug"
      | "price"
      | "medium"
      | "weight_kg"
      | "width_cm"
      | "height_cm"
      | "depth_cm"
    > & {
      images: Pick<Image, "url" | "thumbhash">[];
      gallery: Pick<Gallery, "name" | "slug">;
    };

    prerendered: {
      description: IHTML.Prerendered | null;
    };
  } = $props();

  const [primary_image, ...rest_images] = $derived(piece.images);
</script>

{#if primary_image}
  <section id="images">
    <a
      target="_blank"
      class="cursor-zoom-in"
      title="Open in a new tab"
      href={primary_image.url}
    >
      <Picture image={primary_image} />
    </a>

    {#if rest_images.length}
      <div class="flex flex-wrap gap-2">
        {#each rest_images as image (image.url)}
          <Picture
            {image}
            width={100}
            height={100}
          />
        {/each}
      </div>
    {/if}
  </section>
{/if}

<section id="info">
  <p class="text-xl font-medium">
    {Format.currency(piece.price)}
  </p>

  <p>
    <Icon icon="lucide/brush" />
    {piece.medium}
  </p>

  <p>
    <Icon icon="lucide/ruler-dimension-line" />
    {PieceUtil.format_dimensions(piece)}
  </p>

  {#if piece.weight_kg || true}
    <p>
      <Icon icon="lucide/weight" />
      {Format.number(piece.weight_kg, {
        style: "unit",
        unit: "kilogram",
        unitDisplay: "short",
      })}
    </p>
  {/if}

  <Anchor
    icon="lucide/building"
    href={resolve("/s/gallery/[slug]", piece.gallery)}
  >
    {piece.gallery.name}
  </Anchor>
</section>

{#if prerendered.description}
  <section id="description">
    <PrerenderedMarkdown html={prerendered.description} />
  </section>
{/if}

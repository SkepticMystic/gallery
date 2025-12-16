<script lang="ts">
  import { resolve } from "$app/paths";
  import Picture from "$lib/components/image/Picture.svelte";
  import PrerenderedMarkdown from "$lib/components/text/markdown/PrerenderedMarkdown.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
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
      gallery: Pick<Gallery, "name" | "slug">;
      images: Pick<Image, "url" | "thumbhash" | "width" | "height">[];
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
      <Picture
        class="max-w-fit"
        image={primary_image}
      />
      <!-- width={primary_image.width}
        height={primary_image.height} -->
    </a>

    {#if rest_images.length}
      <div class="flex flex-wrap gap-2">
        {#each rest_images as image (image.url)}
          <a
            target="_blank"
            class="cursor-zoom-in"
            title="Open in a new tab"
            href={image.url}
          >
            <Picture
              {image}
              width={200}
              height={200}
            />
          </a>
        {/each}
      </div>
    {/if}
  </section>
{/if}

<section id="info">
  <Card title="Info">
    {#snippet content()}
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

      {#if piece.weight_kg}
        <p>
          <Icon icon="lucide/weight" />
          {Format.number(piece.weight_kg, {
            style: "unit",
            unit: "kilogram",
            unitDisplay: "short",
          })}
        </p>
      {/if}
    {/snippet}

    {#snippet footer()}
      <Anchor
        icon="lucide/building"
        href={resolve("/s/gallery/[slug]", piece.gallery)}
      >
        {piece.gallery.name}
      </Anchor>
    {/snippet}
  </Card>
</section>

{#if prerendered.description}
  <section id="description">
    <PrerenderedMarkdown html={prerendered.description} />
  </section>
{/if}

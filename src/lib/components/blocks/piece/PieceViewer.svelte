<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import Picture from "$lib/components/image/Picture.svelte";
  import PrerenderedMarkdown from "$lib/components/text/markdown/PrerenderedMarkdown.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import Time from "$lib/components/ui/elements/Time.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import { PIECE } from "$lib/const/piece/piece.const";
  import { get_artist_by_name_remote } from "$lib/remote/artist/artist.remote";
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
      | "status"
      | "medium"
      | "style"
      | "weight_kg"
      | "width_cm"
      | "height_cm"
      | "depth_cm"
      | "updatedAt"
      | "artist_name"
    > & {
      gallery: Pick<Gallery, "name" | "slug">;
      images: Pick<Image, "url" | "thumbhash" | "width" | "height">[];
    };

    prerendered: {
      description: IHTML.Prerendered | null;
    };
  } = $props();

  const dimensions = $derived(PieceUtil.format_dimensions(piece));
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
        prioritize
        class="max-w-fit"
        image={primary_image}
        width={primary_image.width}
        height={primary_image.height}
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
      <dl class="space-y-3">
        <div>
          <dt class="sr-only">Price</dt>
          <dd class="text-xl font-medium">
            {piece.price ? Format.currency(piece.price) : "No price"}
          </dd>
        </div>

        <div>
          <dt class="sr-only">Status</dt>
          <dd>
            <Badge variant="outline">
              {PIECE.STATUS.MAP[piece.status].label}
            </Badge>
          </dd>
        </div>

        <div class="flex flex-wrap gap-x-5 gap-y-2">
          <div class="flex items-center gap-2">
            <dt class="sr-only">Medium</dt>
            <dd>
              <Icon
                icon="lucide/brush"
                label={piece.medium}
              />
            </dd>
          </div>

          {#if piece.style}
            <div class="flex items-center gap-2">
              <dt class="sr-only">Style</dt>
              <dd>
                <Icon
                  icon="lucide/palette"
                  label={piece.style}
                />
              </dd>
            </div>
          {/if}

          {#if dimensions}
            <div class="flex items-center gap-2">
              <dt class="sr-only">Dimensions</dt>
              <dd>
                <Icon
                  icon="lucide/ruler-dimension-line"
                  label={dimensions}
                />
              </dd>
            </div>
          {/if}

          {#if piece.weight_kg}
            <div class="flex items-center gap-2">
              <dt class="sr-only">Weight</dt>
              <dd>
                <Icon
                  icon="lucide/weight"
                  label={Format.number(piece.weight_kg, {
                    style: "unit",
                    unit: "kilogram",
                    unitDisplay: "short",
                  })}
                />
              </dd>
            </div>
          {/if}
        </div>
      </dl>
    {/snippet}

    {#snippet footer()}
      <dl class="flex flex-col gap-1">
        <div>
          <dt class="sr-only">Gallery</dt>
          <dd>
            <Anchor
              icon="lucide/building"
              href={resolve(
                page.route.id?.startsWith("/s/")
                  ? "/s/gallery/[slug]"
                  : "/gallery/[slug]",
                piece.gallery,
              )}
            >
              {piece.gallery.name}
            </Anchor>
          </dd>
        </div>

        {#if piece.artist_name}
          <svelte:boundary>
            {@const artist = await get_artist_by_name_remote(piece.artist_name)}

            {#snippet pending()}
              <div>
                <dt class="sr-only">Artist</dt>
                <dd>
                  <Icon
                    icon="lucide/user"
                    label={piece.artist_name}
                  />
                </dd>
              </div>
            {/snippet}

            <div>
              <dt class="sr-only">Artist</dt>
              <dd>
                {#if artist}
                  <Anchor
                    icon="lucide/user"
                    href={resolve("/artist/[slug]", artist)}
                  >
                    {artist.name}
                  </Anchor>
                {:else}
                  <Icon
                    icon="lucide/user"
                    label={piece.artist_name}
                  />
                {/if}
              </dd>
            </div>
          </svelte:boundary>
        {/if}
      </dl>
    {/snippet}
  </Card>
</section>

{#if prerendered.description}
  <section id="description">
    <Card title="Description">
      {#snippet content()}
        <PrerenderedMarkdown html={prerendered.description} />
      {/snippet}
    </Card>
  </section>
{/if}

<footer id="meta">
  <dl class="text-sm text-muted-foreground">
    <dt class="sr-only">Last updated</dt>
    <dd>
      Last updated: <Time date={piece.updatedAt} />
    </dd>
  </dl>
</footer>

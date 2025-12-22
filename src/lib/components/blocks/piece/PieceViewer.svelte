<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import Picture from "$lib/components/image/Picture.svelte";
  import PrerenderedMarkdown from "$lib/components/text/markdown/PrerenderedMarkdown.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import CardList from "$lib/components/ui/card/CardList.svelte";
  import TermDescription from "$lib/components/ui/element/TermDescription.svelte";
  import Time from "$lib/components/ui/elements/Time.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { PIECE } from "$lib/const/piece/piece.const";
  import { get_artist_by_name_remote } from "$lib/remote/artist/artist.remote";
  import { search_published_pieces_remote } from "$lib/remote/piece/piece.remote";
  import type { Gallery } from "$lib/server/db/models/gallery.model";
  import type { Image } from "$lib/server/db/models/image.model";
  import type { Piece } from "$lib/server/db/models/piece.model";
  import { Format } from "$lib/utils/format.util.js";
  import type { IHTML } from "$lib/utils/html/html.util";
  import { PieceUtil } from "$lib/utils/piece/piece.util.js";
  import { result } from "$lib/utils/result.util";
  import PieceCard from "./PieceCard.svelte";

  let {
    piece,
    prerendered,
  }: {
    piece: Pick<
      Piece,
      | "id"
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
      gallery: Pick<Gallery, "id" | "name" | "slug">;
      images: Pick<Image, "url" | "thumbhash" | "width" | "height">[];
    };

    prerendered: {
      description: IHTML.Prerendered | null;
    };
  } = $props();

  const dimensions = $derived(PieceUtil.format_dimensions(piece));
  const [primary_image, ...rest_images] = $derived(piece.images);

  const related_pieces = $derived(
    search_published_pieces_remote({
      limit: 5,
      where: {
        id: { nin: [piece.id] },
        gallery_id: { in: [piece.gallery.id] },
      },
    }),
  );
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
        <div class="flex flex-wrap gap-x-7">
          <TermDescription
            sr_only
            term="Price"
          >
            {#snippet description()}
              <span class="text-xl font-medium">
                {piece.price ? Format.currency(piece.price) : "No price"}
              </span>
            {/snippet}
          </TermDescription>

          <TermDescription
            sr_only
            term="Status"
          >
            {#snippet description()}
              <Badge variant="outline">
                {PIECE.STATUS.MAP[piece.status].label}
              </Badge>
            {/snippet}
          </TermDescription>
        </div>

        <div class="grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
          <TermDescription
            term="Medium"
            icon="lucide/brush"
            description={piece.medium}
          />

          {#if piece.style}
            <TermDescription
              term="Style"
              icon="lucide/palette"
              description={piece.style}
            />
          {/if}

          {#if dimensions}
            <TermDescription
              term="Dimensions"
              icon="lucide/ruler-dimension-line"
              description={dimensions}
            />
          {/if}

          {#if piece.weight_kg}
            <TermDescription
              term="Weight"
              icon="lucide/weight"
              description={Format.number(piece.weight_kg, {
                style: "unit",
                unit: "kilogram",
                unitDisplay: "short",
              })}
            />
          {/if}
        </div>
      </dl>
    {/snippet}

    {#snippet footer()}
      <dl class="grid w-full gap-x-4 gap-y-2 lg:grid-cols-2">
        <TermDescription
          term="Gallery"
          icon="lucide/building"
        >
          {#snippet description()}
            <Anchor
              href={resolve(
                page.route.id?.startsWith("/s/")
                  ? "/s/gallery/[slug]"
                  : "/gallery/[slug]",
                piece.gallery,
              )}
            >
              {piece.gallery.name}
            </Anchor>
          {/snippet}
        </TermDescription>

        {#if piece.artist_name}
          <svelte:boundary>
            {@const artist = await get_artist_by_name_remote(piece.artist_name)}

            {#snippet pending()}
              <TermDescription
                term="Artist"
                icon="lucide/user"
                description={piece.artist_name}
              />
            {/snippet}

            <TermDescription
              term="Artist"
              icon="lucide/user"
            >
              {#snippet description()}
                {#if artist}
                  <Anchor href={resolve("/artist/[slug]", artist)}>
                    {artist.name}
                  </Anchor>
                {:else}
                  <Icon label={piece.artist_name} />
                {/if}
              {/snippet}
            </TermDescription>
          </svelte:boundary>
        {/if}
      </dl>
    {/snippet}
  </Card>
</section>

{#if prerendered.description}
  {@const html = prerendered.description}

  <section id="description">
    <Card title="Description">
      {#snippet content()}
        <PrerenderedMarkdown {html} />
      {/snippet}
    </Card>
  </section>
{/if}

<footer id="meta">
  <dl class="text-sm text-muted-foreground">
    <TermDescription
      class="flex-row"
      term="Last updated"
    >
      {#snippet description()}
        <Time date={piece.updatedAt} />
      {/snippet}
    </TermDescription>
  </dl>
</footer>

<aside
  id="related"
  class="mt-7"
>
  <div>
    <h2>Related Pieces</h2>
    <p class="text-muted-foreground">Other pieces from the same gallery</p>
  </div>

  <svelte:boundary>
    {#snippet pending()}
      <Skeleton class="h-24 w-full" />
    {/snippet}

    <CardList
      items={result.unwrap_or(await related_pieces, [])}
      empty={{
        icon: "lucide/frame",
        title: "No related pieces",
      }}
    >
      {#snippet card(piece)}
        <PieceCard {piece} />
      {/snippet}
    </CardList>
  </svelte:boundary>
</aside>

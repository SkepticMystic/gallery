<script lang="ts">
  import Picture from "$lib/components/image/Picture.svelte";
  import PrerenderedMarkdown from "$lib/components/text/markdown/PrerenderedMarkdown.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import CardList from "$lib/components/ui/card/CardList.svelte";
  import type { Artist } from "$lib/server/db/models/artist.model";
  import type { Image } from "$lib/server/db/models/image.model";
  import type { Piece } from "$lib/server/db/models/piece.model";
  import type { IHTML } from "$lib/utils/html/html.util";
  import PieceCard from "../piece/PieceCard.svelte";

  let {
    artist,
    prerendered,
  }: {
    artist: Pick<Artist, "name" | "slug" | "updatedAt"> & {
      images: Pick<Image, "id" | "url" | "thumbhash" | "width" | "height">[];
      pieces: (Pick<Piece, "id" | "name" | "slug" | "medium" | "price"> & {
        images: Pick<Image, "url" | "thumbhash" | "width" | "height">[];
      })[];
    };

    prerendered: {
      description: IHTML.Prerendered | null;
    };
  } = $props();
</script>

{#if artist.images.length}
  <section id="images">
    <h2 class="sr-only">Images</h2>

    <div class="flex flex-wrap gap-2">
      {#each artist.images as image, i (image.url)}
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

{#if prerendered.description}
  {@const html = prerendered.description}

  <section id="description">
    <h2 class="sr-only">Description</h2>

    <Card title="About">
      {#snippet content()}
        <PrerenderedMarkdown {html} />
      {/snippet}
    </Card>
  </section>
{/if}

{#if artist.pieces.length}
  <section id="pieces">
    <h2 class="sr-only">Pieces</h2>

    <CardList
      items={artist.pieces}
      empty={{
        icon: "lucide/frame",
        title: "No pieces",
        description: "This artist hasn't got any public pieces at the moment",
      }}
    >
      {#snippet card(piece)}
        <PieceCard {piece} />
      {/snippet}
    </CardList>
  </section>
{/if}

<footer id="meta">
  <h2 class="sr-only">Meta</h2>

  <p class="text-sm text-muted-foreground">
    Last updated: {artist.updatedAt.toLocaleString()}
  </p>
</footer>

<script lang="ts">
  import { resolve } from "$app/paths";
  import Picture from "$lib/components/image/Picture.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import type { Image } from "$lib/server/db/models/image.model";
  import type { Piece } from "$lib/server/db/models/piece.model";
  import { Format } from "$lib/utils/format.util";

  let {
    piece,
  }: {
    piece: Pick<Piece, "name" | "slug" | "medium" | "price"> & {
      images: Pick<Image, "url" | "thumbhash">[];
    };
  } = $props();
</script>

<Card>
  {#snippet title()}
    <Anchor href={resolve("/s/piece/[slug]", piece)}>
      {piece.name}
    </Anchor>
  {/snippet}

  {#snippet description()}
    <span>
      {piece.medium}
    </span>
    {#if piece.price}
      <br />
      <span>
        {Format.currency(piece.price)}
      </span>
    {/if}
  {/snippet}

  {#snippet content()}
    {@const [image] = piece.images}

    {#if image}
      <a href={resolve("/s/piece/[slug]", piece)}>
        <Picture
          {image}
          width={200}
          height={200}
        />
      </a>
    {/if}
  {/snippet}
</Card>

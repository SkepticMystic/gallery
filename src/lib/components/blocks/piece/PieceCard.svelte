<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
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

  const href = $derived(
    resolve(
      page.route.id?.startsWith("/s/") ? "/s/piece/[slug]" : "/piece/[slug]",
      piece,
    ),
  );
</script>

<Card>
  {#snippet title()}
    <Anchor {href}>
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
      <a {href}>
        <Picture
          {image}
          width={200}
          height={200}
        />
      </a>
    {/if}
  {/snippet}
</Card>

<script lang="ts">
  import { resolve } from "$app/paths";
  import PieceCard from "$lib/components/blocks/piece/PieceCard.svelte";
  import PieceViewer from "$lib/components/blocks/piece/PieceViewer.svelte";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import CardList from "$lib/components/ui/card/CardList.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { search_published_pieces_remote } from "$lib/remote/piece/piece.remote.js";
  import { PieceUtil } from "$lib/utils/piece/piece.util.js";
  import { result } from "$lib/utils/result.util.js";

  let { data } = $props();

  const piece = $derived(data.piece);

  const related_pieces = $derived(
    search_published_pieces_remote({
      limit: 5,
      where: {
        id: { nin: [piece.id] },
        gallery_id: { in: [piece.gallery_id] },
      },
    }),
  );
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <h1>{piece.name}</h1>

    <ButtonGroup>
      <ButtonGroup>
        <ShareButton data={PieceUtil.share_data(piece)} />
      </ButtonGroup>

      <ButtonGroup>
        <Button
          icon="lucide/pencil"
          href={resolve("/s/piece/[slug]/edit", piece)}
        >
          Edit
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </header>

  <PieceViewer
    {piece}
    prerendered={data.prerendered}
  />
</article>

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

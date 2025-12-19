<script lang="ts">
  import GalleryViewer from "$lib/components/blocks/gallery/GalleryViewer.svelte";
  import PieceCard from "$lib/components/blocks/piece/PieceCard.svelte";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import CardList from "$lib/components/ui/card/CardList.svelte";
  import { GalleryUtil } from "$lib/utils/gallery/gallery.util.js";

  let { data } = $props();
  const gallery = $state(data.gallery);
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <h1>{gallery.name}</h1>

    <ButtonGroup>
      <ShareButton data={GalleryUtil.share_data(gallery)} />
    </ButtonGroup>
  </header>

  <GalleryViewer
    {gallery}
    prerendered={data.prerendered}
  />

  <section id="pieces">
    <h2>Pieces</h2>

    <CardList
      items={gallery.pieces}
      empty={{
        icon: "lucide/frame",
        title: "No pieces",
        description: "This gallery hasn't got any public pieces at the moment",
      }}
    >
      {#snippet card(piece)}
        <PieceCard {piece} />
      {/snippet}
    </CardList>
  </section>
</article>

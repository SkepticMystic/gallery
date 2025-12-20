<script lang="ts">
  import GalleryViewer from "$lib/components/blocks/gallery/GalleryViewer.svelte";
  import PieceCard from "$lib/components/blocks/piece/PieceCard.svelte";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import Picture from "$lib/components/image/Picture.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import CardList from "$lib/components/ui/card/CardList.svelte";
  import { GalleryUtil } from "$lib/utils/gallery/gallery.util.js";

  let { data } = $props();
  const gallery = $state(data.gallery);
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <Picture
          width={48}
          height={48}
          src={gallery.logo}
          alt="{gallery.name} logo"
        />

        <h1>{gallery.name}</h1>
      </div>

      <Anchor
        href="."
        icon="lucide/arrow-left"
      >
        Back to Galleries
      </Anchor>
    </div>

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

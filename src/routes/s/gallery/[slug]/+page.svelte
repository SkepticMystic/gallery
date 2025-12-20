<script lang="ts">
  import { resolve } from "$app/paths";
  import GalleryViewer from "$lib/components/blocks/gallery/GalleryViewer.svelte";
  import PieceCard from "$lib/components/blocks/piece/PieceCard.svelte";
  import Picture from "$lib/components/image/Picture.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import CardList from "$lib/components/ui/card/CardList.svelte";
  import { App } from "$lib/utils/app.js";

  let { data } = $props();
  const gallery = $state(data.gallery);
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <div class="flex items-center gap-2">
      <Picture
        width={48}
        height={48}
        src={gallery.logo}
        alt="{gallery.name} logo"
      />
      <h1>{gallery.name}</h1>
    </div>

    <ButtonGroup>
      <ButtonGroup>
        <Button
          icon="lucide/pencil"
          href={resolve("/s/gallery/[slug]/edit", gallery)}
        >
          Edit
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button
          icon="lucide/frame"
          href={App.url("/s/piece/create", { gallery_id: gallery.id })}
        >
          Add Piece
        </Button>
      </ButtonGroup>
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

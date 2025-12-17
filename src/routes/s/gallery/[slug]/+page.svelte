<script lang="ts">
  import { resolve } from "$app/paths";
  import GalleryViewer from "$lib/components/blocks/gallery/GalleryViewer.svelte";
  import PieceCard from "$lib/components/blocks/piece/PieceCard.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Empty from "$lib/components/ui/empty/empty.svelte";
  import { App } from "$lib/utils/app.js";

  let { data } = $props();
  const gallery = $state(data.gallery);
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <h1>{gallery.name}</h1>

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

  <section>
    <pre class="font-mono">{JSON.stringify(gallery, null, 2)}</pre>
  </section>

  <GalleryViewer
    {gallery}
    prerendered={data.prerendered}
  />

  <section id="pieces">
    <h2>Pieces</h2>

    <div class="flex flex-wrap gap-3">
      {#each gallery.pieces as piece}
        <PieceCard {piece} />
      {:else}
        <Empty
          icon="lucide/frame"
          title="No pieces"
          description="This gallery hasn't got any public pieces at the moment"
        />
      {/each}
    </div>
  </section>
</article>

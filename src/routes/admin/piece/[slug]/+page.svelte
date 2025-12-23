<script lang="ts">
  import PieceViewer from "$lib/components/blocks/piece/PieceViewer.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";

  let { data } = $props();
  let piece = $state(data.piece);
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <div class="space-y-2">
      <h1>{piece.name}</h1>

      <Anchor
        href="/admin"
        icon="lucide/arrow-left"
      >
        Back to Admin
      </Anchor>
    </div>
  </header>

  <PieceViewer {piece} />
</article>

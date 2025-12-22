<script lang="ts">
  import { resolve } from "$app/paths";
  import PieceViewer from "$lib/components/blocks/piece/PieceViewer.svelte";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { PieceUtil } from "$lib/utils/piece/piece.util.js";

  let { data } = $props();

  const piece = $derived(data.piece);
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

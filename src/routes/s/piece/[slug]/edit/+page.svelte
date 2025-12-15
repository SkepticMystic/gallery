<script lang="ts">
  import PieceForm from "$lib/components/form/piece/PieceForm.svelte";

  let { data } = $props();
</script>

<article>
  <header>
    <h1>{data.piece.name}</h1>
  </header>

  <PieceForm
    mode="update"
    initial={data.piece}
  />
</article>

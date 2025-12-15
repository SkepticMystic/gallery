<script lang="ts">
  import PieceForm from "$lib/components/form/piece/PieceForm.svelte";

  let { data } = $props();
</script>

<article>
  <header>
    <h1>Create a piece</h1>
  </header>

  <PieceForm
    mode="create"
    initial={{ gallery_id: data.search.gallery_id }}
  />
</article>

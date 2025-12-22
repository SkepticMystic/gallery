<script lang="ts">
  import PieceCard from "$lib/components/blocks/piece/PieceCard.svelte";
  import CardList from "$lib/components/ui/card/CardList.svelte";

  let { data } = $props();
</script>

<article>
  <header>
    <h1>Pieces</h1>
    <p class="text-muted-foreground">Discover art pieces near you</p>
  </header>

  <section>
    <CardList
      items={data.pieces}
      empty={{
        icon: "lucide/building-2",
        title: "No pieces yet",
        description: "Check back soon for new pieces",
      }}
    >
      {#snippet card(piece)}
        <PieceCard {piece} />
      {/snippet}
    </CardList>
  </section>
</article>

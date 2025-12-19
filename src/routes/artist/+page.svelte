<script lang="ts">
  import { resolve } from "$app/paths";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Item from "$lib/components/ui/item/Item.svelte";
  import ItemList from "$lib/components/ui/item/ItemList.svelte";

  let { data } = $props();
</script>

<article>
  <header>
    <h1>Artists</h1>
    <p class="text-muted-foreground">Discover artists and their work</p>
  </header>

  <section>
    <ItemList
      items={data.artists}
      empty={{
        icon: "lucide/palette",
        title: "No artists yet",
        description: "Check back soon for new artists",
      }}
    >
      {#snippet item(artist)}
        <Item>
          {#snippet title()}
            <Anchor href={resolve("/artist/[slug]", artist)}>
              {artist.name}
            </Anchor>
          {/snippet}
        </Item>
      {/snippet}
    </ItemList>
  </section>
</article>

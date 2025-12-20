<script lang="ts">
  import GalleryItem from "$lib/components/blocks/gallery/GalleryItem.svelte";
  import ItemList from "$lib/components/ui/item/ItemList.svelte";

  let { data } = $props();
</script>

<article>
  <header>
    <h1>Galleries</h1>
    <p class="text-muted-foreground">Discover galleries near you</p>
  </header>

  <section>
    <ItemList
      items={data.galleries}
      empty={{
        icon: "lucide/building-2",
        title: "No galleries yet",
        description: "Check back soon for new galleries",
      }}
    >
      {#snippet item(gallery)}
        <GalleryItem {gallery} />
      {/snippet}
    </ItemList>
  </section>
</article>

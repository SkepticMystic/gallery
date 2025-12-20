<script lang="ts">
  import { resolve } from "$app/paths";
  import GalleryItem from "$lib/components/blocks/gallery/GalleryItem.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import ItemList from "$lib/components/ui/item/ItemList.svelte";

  let { data } = $props();
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <div>
      <h1>Galleries</h1>
      <p class="text-muted-foreground">Your galleries</p>
    </div>

    <Button
      icon="lucide/plus"
      href={resolve("/s/gallery/create")}
    >
      Create a gallery
    </Button>
  </header>

  <ItemList
    items={data.galleries}
    empty={{
      icon: "lucide/plus",
      title: "You don't have any galleries yet",
      description: "Create one to get started",
    }}
  >
    {#snippet item(gallery)}
      <GalleryItem {gallery} />
    {/snippet}
  </ItemList>
</article>

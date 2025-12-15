<script lang="ts">
  import { resolve } from "$app/paths";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Item from "$lib/components/ui/item/Item.svelte";
  import ItemList from "$lib/components/ui/item/ItemList.svelte";
  import { list_my_galleries_remote } from "$lib/remote/gallery/gallery.remote";
  import { result } from "$lib/utils/result.util";

  const galleries = $derived(await list_my_galleries_remote());
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <h1>Galleries</h1>

    <Button
      icon="lucide/plus"
      href={resolve("/s/gallery/create")}
    >
      Create a gallery
    </Button>
  </header>

  <ItemList
    items={result.unwrap_or(galleries, [])}
    empty={{
      icon: "lucide/plus",
      title: "You don't have any galleries yet",
      description: "Create one to get started",
    }}
  >
    {#snippet item(gallery)}
      <Item>
        {#snippet title()}
          <span class="flex items-center gap-2">
            <img
              src={gallery.logo}
              alt={gallery.name}
              class="h-10 rounded-md"
            />

            <Anchor href={resolve("/s/gallery/[slug]", gallery)}>
              {gallery.name}
            </Anchor>
          </span>
        {/snippet}
      </Item>
    {/snippet}
  </ItemList>
</article>

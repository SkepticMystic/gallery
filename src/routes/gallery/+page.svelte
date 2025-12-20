<script lang="ts">
  import { resolve } from "$app/paths";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Item from "$lib/components/ui/item/Item.svelte";
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
        <Item>
          {#snippet title()}
            <span class="flex items-center gap-2">
              {#if gallery.logo}
                <img
                  src={gallery.logo}
                  alt={gallery.name}
                  class="h-10 w-10 rounded-md object-cover"
                />
              {/if}

              <Anchor href={resolve("/gallery/[slug]", gallery)}>
                {gallery.name}
              </Anchor>
            </span>
          {/snippet}

          {#snippet description()}
            {#if gallery.formatted_address}
              <Icon
                icon="lucide/map-pin"
                label={gallery.formatted_address}
              />
            {/if}
          {/snippet}
        </Item>
      {/snippet}
    </ItemList>
  </section>
</article>

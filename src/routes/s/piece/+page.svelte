<script lang="ts">
  import { resolve } from "$app/paths";
  import Picture from "$lib/components/image/Picture.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Item from "$lib/components/ui/item/Item.svelte";
  import ItemList from "$lib/components/ui/item/ItemList.svelte";
  import { list_my_pieces_remote } from "$lib/remote/piece/piece.remote";
  import { result } from "$lib/utils/result.util";

  const pieces = list_my_pieces_remote();
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <h1>Pieces</h1>

    <Button
      icon="lucide/plus"
      href={resolve("/s/piece/create")}
    >
      Create a piece
    </Button>
  </header>

  <ItemList
    items={result.unwrap_or(pieces.current, [])}
    empty={{
      icon: "lucide/plus",
      title: "You don't have any pieces yet",
      description: "Create one to get started",
      loading: pieces.loading,
    }}
  >
    {#snippet item(piece)}
      <Item>
        {#snippet title()}
          <span class="flex items-center gap-2">
            <Picture
              alt={piece.name}
              image={piece.images[0]}
              class="h-10 rounded-md"
            />

            <Anchor href={resolve("/s/piece/[slug]", piece)}>
              {piece.name}
            </Anchor>
          </span>
        {/snippet}
      </Item>
    {/snippet}
  </ItemList>
</article>

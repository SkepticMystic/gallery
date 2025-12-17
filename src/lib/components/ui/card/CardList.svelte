<script
  lang="ts"
  generics="T extends Item"
>
  import type { Item } from "$lib/utils/items.util";
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";
  import Empty, { type EmptyProps } from "../empty/empty.svelte";

  let {
    card,
    items,
    empty,
    class: klass,
  }: {
    items: T[];
    empty?: EmptyProps;
    class?: ClassValue;
    card: Snippet<[T, number]>;
  } = $props();
</script>

<div class={["flex flex-wrap gap-2", klass]}>
  {#each items as row, i (row.id)}
    {@render card(row, i)}
  {:else}
    <Empty {...empty}></Empty>
  {/each}
</div>

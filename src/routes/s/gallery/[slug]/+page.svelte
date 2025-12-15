<script lang="ts">
  import { resolve } from "$app/paths";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  let { data } = $props();
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <h1>{data.gallery.name}</h1>

    <ButtonGroup>
      <Button
        icon="lucide/pencil"
        href={resolve("/s/gallery/[slug]/edit", data.gallery)}
      >
        Edit
      </Button>
    </ButtonGroup>
  </header>
</article>

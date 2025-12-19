<script lang="ts">
  import ArtistViewer from "$lib/components/blocks/artist/ArtistViewer.svelte";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import { ArtistUtil } from "$lib/utils/artist/artist.util.js";

  let { data } = $props();
  const artist = $derived(data.artist);
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <h1>{artist.name}</h1>

    <ButtonGroup>
      <ShareButton data={ArtistUtil.share_data(artist)} />
    </ButtonGroup>
  </header>

  <ArtistViewer
    {artist}
    prerendered={data.prerendered}
  />
</article>

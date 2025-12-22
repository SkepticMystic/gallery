<script lang="ts">
  import { resolve } from "$app/paths";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { count_public_artists_remote } from "$lib/remote/artist/artist.remote";
  import { count_public_galleries_remote } from "$lib/remote/gallery/gallery.remote";
  import { count_public_pieces_remote } from "$lib/remote/piece/piece.remote";
  import { Format } from "$lib/utils/format.util";

  const pieces = count_public_pieces_remote();
  const artists = count_public_artists_remote();
  const galleries = count_public_galleries_remote();
</script>

<div class="grid gap-x-4 gap-y-4 sm:grid-cols-3">
  <a
    href={resolve("/gallery")}
    class="flex flex-col items-center gap-y-2"
  >
    <p class="text-4xl font-medium">
      {#if galleries.current === undefined}
        <Skeleton class="h-9 w-12" />
      {:else}
        {Format.number(galleries.current)}
      {/if}
    </p>

    <p>Galleries</p>
  </a>

  <a
    href={resolve("/artist")}
    class="flex flex-col items-center gap-y-2"
  >
    <p class="text-4xl font-medium">
      {#if artists.current === undefined}
        <Skeleton class="h-9 w-12" />
      {:else}
        {Format.number(artists.current)}
      {/if}
    </p>

    <p>Artists</p>
  </a>

  <a
    href={resolve("/piece")}
    class="flex flex-col items-center gap-y-2"
  >
    <p class="text-4xl font-medium">
      {#if pieces.current === undefined}
        <Skeleton class="h-9 w-12" />
      {:else}
        {Format.number(pieces.current)}
      {/if}
    </p>

    <p>Pieces</p>
  </a>
</div>

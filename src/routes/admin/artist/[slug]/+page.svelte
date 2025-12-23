<script lang="ts">
  import { resolve } from "$app/paths";
  import { ArtistClient } from "$lib/clients/artist/artist.client.js";
  import ArtistViewer from "$lib/components/blocks/artist/ArtistViewer.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  let { data } = $props();
  let artist = $state(data.artist);

  const toggle_approved = () =>
    ArtistClient.toggle_approved(artist.id, {
      on_success: () => (artist.is_approved = !artist.is_approved),
    });
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <div class="space-y-2">
      <h1>{artist.name}</h1>

      <Anchor
        href="."
        icon="lucide/arrow-left"
      >
        Back to Artists
      </Anchor>
    </div>

    <ButtonGroup>
      <ButtonGroup>
        <Button
          variant={artist.is_approved ? "destructive" : "default"}
          icon={artist.is_approved ? "lucide/x-circle" : "lucide/check-circle"}
          onclick={toggle_approved}
        >
          {artist.is_approved ? "Remove Approval" : "Approve"}
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          icon="lucide/edit"
          variant="outline"
          href={resolve("/admin/artist/[slug]/edit", artist)}
        >
          Edit
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </header>

  <ArtistViewer
    {artist}
    prerendered={data.prerendered}
  />
</article>

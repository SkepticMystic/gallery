<script lang="ts">
  import { GalleryClient } from "$lib/clients/gallery/gallery.client.js";
  import GalleryViewer from "$lib/components/blocks/gallery/GalleryViewer.svelte";
  import Picture from "$lib/components/image/Picture.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  let { data } = $props();
  let gallery = $state(data.gallery);

  const toggle_approval = async () => {
    const res = await GalleryClient.toggle_approved(gallery.id);

    if (res.ok) {
      gallery.is_approved = !gallery.is_approved;
    }
  };
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <Picture
          width={48}
          height={48}
          src={gallery.logo}
          alt="{gallery.name} logo"
        />

        <h1>{gallery.name}</h1>
      </div>

      <Anchor
        href="."
        icon="lucide/arrow-left"
      >
        Back to Galleries
      </Anchor>
    </div>

    <ButtonGroup>
      <Button
        variant={gallery.is_approved ? "destructive" : "default"}
        icon={gallery.is_approved ? "lucide/x-circle" : "lucide/check-circle"}
        onclick={toggle_approval}
      >
        {gallery.is_approved ? "Remove Approval" : "Approve"}
      </Button>
    </ButtonGroup>
  </header>

  <GalleryViewer
    {gallery}
    prerendered={data.prerendered}
  />
</article>

<script lang="ts">
  import { resolve } from "$app/paths";
  import GalleryViewer from "$lib/components/blocks/gallery/GalleryViewer.svelte";
  import Picture from "$lib/components/image/Picture.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { count_my_page_views_by_resource_remote } from "$lib/remote/page_view/page_view.remote.js";
  import { App } from "$lib/utils/app.js";
  import { Format } from "$lib/utils/format.util";

  let { data } = $props();
  const gallery = $state(data.gallery);

  const page_views = count_my_page_views_by_resource_remote({
    resource_id: gallery.id,
    resource_kind: "gallery",
  });
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
        Back to My Galleries
      </Anchor>
    </div>

    <ButtonGroup>
      <ButtonGroup>
        <Button
          variant="ghost"
          icon="lucide/eye"
        >
          {Format.number(page_views.current)} views
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          variant="outline"
          icon="lucide/pencil"
          href={resolve("/s/gallery/[slug]/edit", gallery)}
        >
          Edit
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          variant="secondary"
          icon="lucide/frame"
          href={App.url("/s/piece/create", { gallery_id: gallery.id })}
        >
          Add Piece
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </header>

  <GalleryViewer
    {gallery}
    prerendered={data.prerendered}
  />
</article>

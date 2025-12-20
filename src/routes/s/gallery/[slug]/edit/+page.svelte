<script lang="ts">
  import { ImageClient } from "$lib/clients/image/image.client.js";
  import GalleryForm from "$lib/components/form/gallery/GalleryForm.svelte";
  import UploadImagesForm from "$lib/components/form/image/UploadImagesForm.svelte";
  import Picture from "$lib/components/image/Picture.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Empty from "$lib/components/ui/empty/empty.svelte";
  import { format_bytes } from "$lib/components/ui/file-drop-zone/index.js";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { Items } from "$lib/utils/items.util.js";

  let { data } = $props();
  let gallery = $state(data.gallery);
</script>

<article>
  <header>
    <h1>{gallery.name}</h1>

    <Anchor href="#images">Jump to Images</Anchor>
  </header>

  <GalleryForm
    mode="update"
    initial={gallery}
  />

  <Separator />

  <section id="images">
    <h2>Images</h2>

    <UploadImagesForm
      resource_kind="gallery"
      resource_id={gallery.id}
      after_upload={(results) =>
        results.forEach((r) => (r.ok ? gallery.images.push(r.data) : void 0))}
    />

    <Separator />

    <div class="flex flex-wrap gap-3">
      {#each gallery.images as image (image.id)}
        <div class="flex flex-col gap-2">
          <Picture
            {image}
            width={200}
            height={200}
          />

          <div class="flex justify-between">
            <div class="flex flex-col gap-1">
              <Badge
                class="h-6"
                variant="outline"
              >
                {format_bytes(image.size)}
              </Badge>

              <Badge
                class="h-6"
                variant="outline"
              >
                {image.width} x {image.height}
              </Badge>
            </div>

            <ButtonGroup>
              <Button
                icon="lucide/trash"
                variant="destructive"
                onclick={() =>
                  ImageClient.delete(image.id).then((r) => {
                    if (r.ok) {
                      gallery.images = Items.remove(gallery.images, image.id);
                    }
                  })}
              >
                Delete
              </Button>
            </ButtonGroup>
          </div>
        </div>
      {:else}
        <Empty
          icon="lucide/frame"
          title="No images"
          description="There haven't been any images added to this gallery yet"
        />
      {/each}
    </div>
  </section>
</article>

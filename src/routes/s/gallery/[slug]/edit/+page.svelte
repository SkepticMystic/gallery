<script lang="ts">
  import GalleryForm from "$lib/components/form/gallery/GalleryForm.svelte";

  let { data } = $props();
</script>

<article>
  <header>
    <h1>{data.gallery.name}</h1>
  </header>

  <GalleryForm
    mode="update"
    initial={data.gallery}
  />
</article>

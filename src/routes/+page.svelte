<script lang="ts">
  import { resolve } from "$app/paths";
  import FeaturesBlock from "$lib/components/blocks/app/FeaturesBlock.svelte";
  import StatsBlock from "$lib/components/blocks/app/StatsBlock.svelte";
  import GalleryItem from "$lib/components/blocks/gallery/GalleryItem.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Logo from "$lib/components/ui/image/Logo.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { APP } from "$lib/const/app.const";
  import { get_random_public_gallery_remote } from "$lib/remote/gallery/gallery.remote";

  const featured_gallery = get_random_public_gallery_remote();
</script>

<article class="mx-auto mt-32 flex max-w-lg flex-col gap-y-7">
  <header class="flex flex-col items-center gap-4">
    <Logo size="size-16" />
    <h1>{APP.NAME}</h1>
    <p>{APP.DESCRIPTION}</p>
  </header>

  <section class="flex justify-center pb-10">
    <ButtonGroup>
      <ButtonGroup>
        <Button href="/gallery">Browse Galleries</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          href="/s/gallery"
          variant="secondary"
        >
          My Galleries
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </section>

  <section
    id="featured"
    class="w-full"
  >
    <h2>Featured</h2>

    {#if !featured_gallery.current}
      <Skeleton class="h-32 w-full" />
    {:else if featured_gallery.current.ok}
      <GalleryItem
        variant="outline"
        gallery={featured_gallery.current.data}
      />
    {:else}{/if}
  </section>

  <section id="features">
    <h2>About</h2>
    <FeaturesBlock />
  </section>

  <section id="stats">
    <StatsBlock />
  </section>

  <section id="contact">
    <h2>Interested?</h2>
    <p>We'd love to hear from you!</p>

    <Button
      size="lg"
      icon="lucide/mail"
      href={resolve("/contact")}
    >
      Contact Us
    </Button>
  </section>
</article>

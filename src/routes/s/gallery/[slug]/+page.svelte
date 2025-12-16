<script lang="ts">
  import { resolve } from "$app/paths";
  import Picture from "$lib/components/image/Picture.svelte";
  import GooglePlaceLink from "$lib/components/link/GooglePlaceLink.svelte";
  import GoogleMapIFrame from "$lib/components/map/GoogleMapIFrame.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import Empty from "$lib/components/ui/empty/empty.svelte";
  import { App } from "$lib/utils/app.js";
  import { Format } from "$lib/utils/format.util";

  let { data } = $props();
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <h1>{data.gallery.name}</h1>

    <ButtonGroup>
      <ButtonGroup>
        <Button
          icon="lucide/pencil"
          href={resolve("/s/gallery/[slug]/edit", data.gallery)}
        >
          Edit
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button
          icon="lucide/frame"
          href={App.url("/s/piece/create", { gallery_id: data.gallery.id })}
        >
          Add Piece
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </header>

  <section>
    <pre class="font-mono">{JSON.stringify(data.gallery, null, 2)}</pre>
  </section>

  <section id="location">
    <h2>Location</h2>
    <GooglePlaceLink
      class="text-sm text-muted-foreground"
      google_place_id={data.gallery.google_place_id}
      formatted_address={data.gallery.formatted_address}
    />
    <GoogleMapIFrame
      google_place_id={data.gallery.google_place_id}
      formatted_address={data.gallery.formatted_address}
    />
  </section>

  <section id="pieces">
    <h2>Pieces</h2>

    <div class="flex flex-wrap gap-3">
      {#each data.gallery.pieces as piece}
        <Card>
          {#snippet title()}
            <Anchor href={resolve("/s/piece/[slug]", piece)}>
              {piece.name}
            </Anchor>
          {/snippet}

          {#snippet description()}
            <span>
              {piece.medium}
            </span>

            <span>
              {Format.currency(piece.price)}
            </span>
          {/snippet}

          {#snippet content()}
            {@const [image] = piece.images}

            {#if image}
              <Picture
                {image}
                width={100}
                height={100}
              />
            {/if}
          {/snippet}
        </Card>
      {:else}
        <Empty
          icon="lucide/frame"
          title="No pieces"
          description="This gallery hasn't got any public pieces at the moment"
        />
      {/each}
    </div>
  </section>
</article>

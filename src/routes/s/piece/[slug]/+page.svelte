<script lang="ts">
  import { resolve } from "$app/paths";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import Picture from "$lib/components/image/Picture.svelte";
  import PrerenderedMarkdown from "$lib/components/text/markdown/PrerenderedMarkdown.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import { APP } from "$lib/const/app.const.js";
  import { App } from "$lib/utils/app.js";
  import { Format } from "$lib/utils/format.util.js";
  import { PieceUtil } from "$lib/utils/piece/piece.util.js";

  let { data } = $props();

  const piece = $derived(data.piece);
  const [primary_image, ...rest_images] = $derived(piece.images);
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <h1>{piece.name}</h1>

    <ButtonGroup>
      <ButtonGroup>
        <ShareButton
          data={{
            title: piece.name,
            text: "Checkout this piece on " + APP.NAME,
            // NOTE: Don't use `resolve` here, it adds a base route which breaks things
            url: App.full_url(`/piece/${piece.slug}`).toString(),
          }}
        />
      </ButtonGroup>
      <ButtonGroup>
        <Button
          icon="lucide/pencil"
          href={resolve("/s/piece/[slug]/edit", piece)}
        >
          Edit
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </header>

  {#if primary_image}
    <section id="images">
      <a
        target="_blank"
        class="cursor-zoom-in"
        title="Open in a new tab"
        href={primary_image.url}
      >
        <Picture image={primary_image} />
      </a>

      {#if rest_images.length}
        <div class="flex flex-wrap gap-2">
          {#each rest_images as image (image.id)}
            <Picture
              {image}
              width={100}
              height={100}
            />
          {/each}
        </div>
      {/if}
    </section>
  {/if}

  <section id="info">
    <p class="text-xl font-medium">
      {Format.currency(piece.price)}
    </p>

    <p>
      <Icon icon="lucide/brush" />
      {piece.medium}
    </p>

    <p>
      <Icon icon="lucide/ruler-dimension-line" />
      {PieceUtil.format_dimensions(piece)}
    </p>

    {#if piece.weight_kg || true}
      <p>
        <Icon icon="lucide/weight" />
        {Format.number(piece.weight_kg, {
          style: "unit",
          unit: "kilogram",
          unitDisplay: "short",
        })}
      </p>
    {/if}

    <Anchor
      icon="lucide/building"
      href={resolve("/s/gallery/[slug]", piece.gallery)}
    >
      {piece.gallery.name}
    </Anchor>
  </section>

  {#if data.prerendered.description}
    <section id="description">
      <PrerenderedMarkdown html={data.prerendered.description} />
    </section>
  {/if}
</article>

<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import Picture from "$lib/components/image/Picture.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import TermDescription from "$lib/components/ui/element/TermDescription.svelte";
  import { get_artist_by_name_remote } from "$lib/remote/artist/artist.remote";
  import type { Gallery } from "$lib/server/db/models/gallery.model";
  import type { Image } from "$lib/server/db/models/image.model";
  import type { Piece } from "$lib/server/db/models/piece.model";
  import { Format } from "$lib/utils/format.util";

  let {
    piece,
  }: {
    piece: Pick<
      Piece,
      "id" | "name" | "slug" | "medium" | "price" | "artist_name"
    > & {
      gallery?: Pick<Gallery, "name" | "slug">;
      images: Pick<Image, "url" | "thumbhash">[];
    };
  } = $props();

  const href = $derived(
    resolve(
      page.route.id?.startsWith("/s/")
        ? "/s/piece/[slug]"
        : page.route.id?.startsWith("/admin/")
          ? "/admin/piece/[slug]"
          : "/piece/[slug]",
      piece,
    ),
  );

  const gallery_href = $derived(
    piece.gallery
      ? resolve(
          page.route.id?.startsWith("/s/")
            ? "/s/gallery/[slug]"
            : page.route.id?.startsWith("/admin/")
              ? "/admin/gallery/[slug]"
              : "/gallery/[slug]",
          piece.gallery,
        )
      : null,
  );
</script>

<Card>
  {#snippet title()}
    <Anchor {href}>
      {piece.name}
    </Anchor>
  {/snippet}

  {#snippet content()}
    {@const [image] = piece.images}

    <div class="flex flex-col gap-3">
      {#if image}
        <a
          {href}
          aria-label={piece.name}
        >
          <Picture
            {image}
            width={200}
            height={200}
            alt={piece.name}
          />
        </a>
      {/if}

      <dl>
        <TermDescription
          sr_only
          term="Medium"
          description={piece.medium}
        />

        {#if piece.price}
          <TermDescription
            sr_only
            term="Price"
            description={Format.currency(piece.price)}
          />
        {/if}

        {#if piece.gallery}
          {@const { gallery } = piece}

          <TermDescription
            sr_only
            term="Gallery"
          >
            {#snippet description()}
              <Anchor href={gallery_href}>
                {gallery.name}
              </Anchor>
            {/snippet}
          </TermDescription>
        {/if}

        {#if piece.artist_name}
          <svelte:boundary>
            {@const artist = await get_artist_by_name_remote(piece.artist_name)}

            {#snippet pending()}
              <TermDescription
                term="Artist"
                icon="lucide/user"
                description={piece.artist_name}
              />
            {/snippet}

            <TermDescription
              sr_only
              term="Artist"
              icon="lucide/user"
            >
              {#snippet description()}
                {#if artist}
                  <Anchor href={resolve("/artist/[slug]", artist)}>
                    {artist.name}
                  </Anchor>
                {:else}
                  {piece.artist_name}
                {/if}
              {/snippet}
            </TermDescription>
          </svelte:boundary>
        {/if}
      </dl>
    </div>
  {/snippet}
</Card>

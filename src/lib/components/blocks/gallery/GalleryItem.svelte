<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import Picture from "$lib/components/image/Picture.svelte";
  import GooglePlaceLink from "$lib/components/link/GooglePlaceLink.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import ItemRoot from "$lib/components/ui/item/item-root.svelte";
  import Item from "$lib/components/ui/item/Item.svelte";
  import type { Gallery } from "$lib/server/db/models/gallery.model";
  import type { ComponentProps } from "svelte";

  let {
    gallery,
    ...rest
  }: Omit<ComponentProps<typeof ItemRoot>, "title"> & {
    gallery: Pick<
      Gallery,
      "id" | "logo" | "name" | "slug" | "google_place_id" | "formatted_address"
    >;
  } = $props();

  const href = $derived(
    resolve(
      page.route.id?.startsWith("/s/")
        ? "/s/gallery/[slug]"
        : page.route.id?.startsWith("/admin/")
          ? "/admin/gallery/[slug]"
          : "/gallery/[slug]",
      gallery,
    ),
  );
</script>

<Item {...rest}>
  {#snippet media()}
    <Picture
      {href}
      width={48}
      height={48}
      src={gallery.logo}
      alt={gallery.name}
      fallback={gallery.name[0]}
    />
  {/snippet}

  {#snippet title()}
    <Anchor
      {href}
      class="text-lg font-semibold"
    >
      {gallery.name}
    </Anchor>
  {/snippet}

  {#snippet description()}
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
      <!-- NOTE: We don't _need_ the place_id, google will still fallback to address -->
      {#if gallery.formatted_address}
        <span>
          <Icon icon="lucide/map-pin" />

          <GooglePlaceLink
            class="no-underline hover:underline"
            google_place_id={gallery.google_place_id}
            formatted_address={gallery.formatted_address}
          />
        </span>
      {/if}
    </div>
  {/snippet}

  {#snippet actions()}
    <ButtonGroup>
      <Button {href}>
        View
        <Icon icon="lucide/arrow-right" />
      </Button>
    </ButtonGroup>
  {/snippet}
</Item>

<script lang="ts">
  import { resolve } from "$app/paths";
  import { ArtistClient } from "$lib/clients/artist/artist.client.js";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import DataTable from "$lib/components/ui/data-table/data-table.svelte";
  import { renderComponent } from "$lib/components/ui/data-table/render-helpers.js";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { Format } from "$lib/utils/format.util.js";
  import { Items } from "$lib/utils/items.util.js";
  import { CellHelpers } from "$lib/utils/tanstack/table.util.js";
  import { createColumnHelper } from "@tanstack/table-core";

  let { data } = $props();
  let artists = $state(data.artists);

  const column = createColumnHelper<(typeof artists)[number]>();

  const columns = [
    column.accessor("name", {
      meta: { label: "Name" },

      cell: ({ row, getValue }) =>
        renderComponent(Anchor, {
          content: getValue(),
          href: resolve("/admin/artist/[slug]", row.original),
        }),

      footer: ({ table }) =>
        Format.number(table.getRowModel().flatRows.length) + " artists",
    }),

    column.accessor("pieces", {
      meta: { label: "Pieces" },

      cell: ({ getValue }) => Format.number(getValue().length),
    }),

    column.accessor("is_approved", {
      meta: { label: "Status" },

      cell: ({ getValue }) => (getValue() ? "Approved" : "Pending"),
    }),

    column.accessor("createdAt", {
      meta: { label: "Created" },

      cell: CellHelpers.time,
    }),
  ];

  const actions = {
    delete: async (artist_id: string) => {
      const res = await ArtistClient.admin_delete(artist_id);

      if (res.ok) {
        artists = Items.remove(artists, artist_id);
      }
    },

    toggle_approved: async (id: string) => {
      const res = await ArtistClient.toggle_approved(id);

      if (res.ok) {
        artists = Items.patch(artists, id, res.data);
      }
    },
  };
</script>

<article>
  <header>
    <div class="space-y-2">
      <h1>Artists</h1>

      <Anchor
        href="."
        icon="lucide/arrow-left"
      >
        Back to Admin
      </Anchor>
    </div>
  </header>

  <DataTable
    {columns}
    data={artists}
    actions={(row) => [
      {
        icon: row.original.is_approved
          ? "lucide/x-circle"
          : "lucide/check-circle",
        title: row.original.is_approved //
          ? "Remove approval"
          : "Approve artist",

        onselect: () => actions.toggle_approved(row.id),
      },
      {
        icon: "lucide/x",
        title: "Delete artist",
        variant: "destructive",
        onselect: () => actions.delete(row.id),
      },
    ]}
  >
    {#snippet header(table)}
      <search class="flex flex-wrap gap-2">
        <Field label="Name">
          {#snippet input({ props })}
            <Input
              {...props}
              placeholder="Search by name"
              bind:value={
                () => table.getColumn("name")?.getFilterValue(),
                (v) => table.getColumn("name")?.setFilterValue(v)
              }
            />
          {/snippet}
        </Field>
      </search>
    {/snippet}
  </DataTable>
</article>

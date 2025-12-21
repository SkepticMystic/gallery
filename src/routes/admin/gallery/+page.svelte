<script lang="ts">
  import { resolve } from "$app/paths";
  import { GalleryClient } from "$lib/clients/gallery/gallery.client.js";
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
  let galleries = $state(data.galleries);

  const column = createColumnHelper<(typeof galleries)[number]>();

  const columns = [
    column.accessor("name", {
      meta: { label: "Name" },

      cell: ({ row, getValue }) =>
        renderComponent(Anchor, {
          content: getValue(),
          href: resolve("/admin/gallery/[slug]", row.original),
        }),

      footer: ({ table }) =>
        Format.number(table.getRowModel().flatRows.length) + " galleries",
    }),

    column.accessor("org", {
      meta: { label: "Organization" },

      cell: ({ getValue }) => getValue().name,
    }),

    column.accessor("pieces", {
      meta: { label: "Pieces" },

      cell: ({ getValue }) => Format.number(getValue().length),
    }),

    column.accessor("admin_approved", {
      meta: { label: "Status" },

      cell: ({ getValue }) => (getValue() ? "Approved" : "Pending"),
    }),

    column.accessor("createdAt", {
      meta: { label: "Created" },

      cell: CellHelpers.time,
    }),
  ];

  const actions = {
    delete: async (gallery_id: string) => {
      const res = await GalleryClient.admin_delete(gallery_id);

      if (res.ok) {
        galleries = Items.remove(galleries, gallery_id);
      }
    },

    approve: async (gallery_id: string, approved: boolean) => {
      const res = await GalleryClient.admin_approve({ gallery_id, approved });

      if (res.ok) {
        galleries = Items.patch(galleries, gallery_id, {
          admin_approved: approved,
        });
      }
    },
  };
</script>

<article>
  <header>
    <div class="space-y-2">
      <h1>Galleries</h1>

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
    data={galleries}
    actions={(row) => [
      {
        icon: row.original.admin_approved
          ? "lucide/x-circle"
          : "lucide/check-circle",
        title: row.original.admin_approved
          ? "Remove approval"
          : "Approve gallery",
        onselect: () => actions.approve(row.id, !row.original.admin_approved),
      },
      {
        icon: "lucide/x",
        title: "Delete gallery",
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

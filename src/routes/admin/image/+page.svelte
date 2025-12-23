<script lang="ts">
  import { ImageClient } from "$lib/clients/image/image.client.js";
  import Picture from "$lib/components/image/Picture.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import DataTable from "$lib/components/ui/data-table/data-table.svelte";
  import { renderComponent } from "$lib/components/ui/data-table/render-helpers.js";
  import Span from "$lib/components/ui/element/Span.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import { format_bytes } from "$lib/components/ui/file-drop-zone/index.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import NativeSelectOption from "$lib/components/ui/native-select/native-select-option.svelte";
  import NativeSelect from "$lib/components/ui/native-select/native-select.svelte";
  import { RESOURCES } from "$lib/const/resource/resource.const.js";
  import { Format } from "$lib/utils/format.util.js";
  import { Items } from "$lib/utils/items.util.js";
  import { CellHelpers } from "$lib/utils/tanstack/table.util.js";
  import { createColumnHelper } from "@tanstack/table-core";

  let { data } = $props();
  let images = $state(data.images);

  const column = createColumnHelper<(typeof images)[number]>();

  const columns = [
    column.display({
      id: "thumbnail",
      meta: { label: "" },

      cell: ({ row }) =>
        renderComponent(Picture, {
          width: 100,
          height: 100,
          image: row.original,
        }),

      footer: ({ table }) =>
        Format.number(table.getRowModel().flatRows.length) + " images",
    }),

    column.accessor("org", {
      meta: { label: "Organization" },

      cell: ({ getValue }) => getValue().name,
    }),

    column.accessor("resource_kind", {
      meta: { label: "Resource Type" },

      cell: ({ getValue }) => RESOURCES.KIND.MAP[getValue()].label,
    }),

    column.display({
      id: "dimensions",
      meta: { label: "Dimensions" },

      cell: ({ row }) =>
        renderComponent(Span, {
          content: `${row.original.width}x${row.original.height}`,
          class: "text-sm text-muted-foreground font-mono",
        }),
    }),

    column.accessor("size", {
      meta: { label: "Size" },

      cell: ({ getValue }) =>
        renderComponent(Span, {
          content: format_bytes(getValue()),
          class: "text-sm text-muted-foreground font-mono",
        }),
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
    delete: async (image_id: string) => {
      const res = await ImageClient.admin_delete(image_id);

      if (res.ok) {
        images = Items.remove(images, image_id);
      }
    },

    toggle_approved: async (image_id: string) => {
      const res = await ImageClient.toggle_approved(image_id);

      if (res.ok) {
        images = Items.patch(images, image_id, res.data);
      }
    },
  };
</script>

<article>
  <header>
    <div class="space-y-2">
      <h1>Images</h1>

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
    data={images}
    actions={(row) => [
      {
        icon: row.original.is_approved
          ? "lucide/x-circle"
          : "lucide/check-circle",
        title: row.original.is_approved ? "Remove approval" : "Approve image",
        onselect: () => actions.toggle_approved(row.id),
      },
      {
        icon: "lucide/x",
        title: "Delete image",
        variant: "destructive",
        onselect: () => actions.delete(row.id),
      },
    ]}
  >
    {#snippet header(table)}
      <search class="flex flex-wrap gap-2">
        <Field
          class="w-fit"
          label="Organization"
        >
          {#snippet input({ props })}
            <Input
              {...props}
              placeholder="Search by organization"
              bind:value={
                () => table.getColumn("org")?.getFilterValue(),
                (v) => table.getColumn("org")?.setFilterValue(v)
              }
            />
          {/snippet}
        </Field>

        <Field
          class="w-fit"
          label="Resource Type"
        >
          {#snippet input({ props })}
            <NativeSelect
              {...props}
              placeholder="Search by resource type"
              options={RESOURCES.KIND.IDS.map((id) => ({
                value: id,
                label: RESOURCES.KIND.MAP[id].label,
              }))}
              bind:value={
                () => table.getColumn("resource_kind")?.getFilterValue(),
                (v) => table.getColumn("resource_kind")?.setFilterValue(v)
              }
            >
              <NativeSelectOption value="">All</NativeSelectOption>
            </NativeSelect>
          {/snippet}
        </Field>
      </search>
    {/snippet}
  </DataTable>
</article>

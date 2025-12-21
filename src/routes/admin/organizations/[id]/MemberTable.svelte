<script lang="ts">
  import Avatar from "$lib/components/ui/avatar/avatar.svelte";
  import DataTable from "$lib/components/ui/data-table/data-table.svelte";
  import { renderComponent } from "$lib/components/ui/data-table/render-helpers.js";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import NativeSelect from "$lib/components/ui/native-select/native-select.svelte";
  import { ORGANIZATION } from "$lib/const/auth/organization.const.js";
  import { CellHelpers } from "$lib/utils/tanstack/table.util.js";
  import { createColumnHelper } from "@tanstack/table-core";
  import type { PageData } from "./$types.js";

  type Member = PageData["organization"]["members"][number];

  let { members }: { members: Member[] } = $props();

  const column = createColumnHelper<Member>();

  const columns = [
    column.display({
      id: "avatar",
      enableHiding: false,
      enableSorting: false,

      cell: ({ row }) => {
        const user = row.original.user;
        const label = user.name || user.email;

        return renderComponent(Avatar, {
          title: label,
          src: user.image,
          alt: `${label} avatar`,
          fallback: label.at(0) || "?",
        });
      },
    }),

    column.accessor("user.name", {
      id: "user.name",
      meta: { label: "Name" },
    }),

    column.accessor("user.email", {
      id: "user.email",
      meta: { label: "Email" },
    }),

    column.accessor("role", {
      meta: { label: "Role" },

      cell: ({ getValue }) => ORGANIZATION.ROLES.MAP[getValue()].label,
    }),

    column.accessor("createdAt", {
      meta: { label: "Joined" },

      cell: CellHelpers.time,
    }),
  ];
</script>

<DataTable
  {columns}
  data={members}
>
  {#snippet header(table)}
    <search class="flex flex-wrap gap-2">
      <Field label="Name">
        {#snippet input({ props })}
          <Input
            {...props}
            placeholder="Search by name"
            bind:value={
              () => table.getColumn("user.name")?.getFilterValue(),
              (v) => table.getColumn("user.name")?.setFilterValue(v)
            }
          />
        {/snippet}
      </Field>

      <Field label="Email">
        {#snippet input({ props })}
          <Input
            {...props}
            placeholder="Search by email"
            bind:value={
              () => table.getColumn("user.email")?.getFilterValue(),
              (v) => table.getColumn("user.email")?.setFilterValue(v)
            }
          />
        {/snippet}
      </Field>

      <Field label="Role">
        {#snippet input({ props })}
          <NativeSelect
            {...props}
            options={[
              { value: undefined, label: "All" },
              ...ORGANIZATION.ROLES.OPTIONS,
            ]}
            bind:value={
              () => table.getColumn("role")?.getFilterValue(),
              (v) => table.getColumn("role")?.setFilterValue(v)
            }
          />
        {/snippet}
      </Field>
    </search>
  {/snippet}
</DataTable>

<script lang="ts">
  import DataTable from "$lib/components/ui/data-table/data-table.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import NativeSelect from "$lib/components/ui/native-select/native-select.svelte";
  import { ORGANIZATION } from "$lib/const/auth/organization.const.js";
  import { CellHelpers } from "$lib/utils/tanstack/table.util.js";
  import { createColumnHelper } from "@tanstack/table-core";
  import type { PageData } from "./$types";

  type Invitation = PageData["organization"]["invitations"][number];

  let { invitations }: { invitations: Invitation[] } = $props();

  const column = createColumnHelper<Invitation>();

  const columns = [
    column.accessor("email", {
      meta: { label: "Email" },
    }),

    column.accessor("role", {
      meta: { label: "Role" },

      cell: ({ getValue }) => ORGANIZATION.ROLES.MAP[getValue()].label,
    }),

    column.accessor("status", {
      meta: { label: "Status" },
    }),

    column.accessor("inviter.name", {
      meta: { label: "Invited by" },
    }),

    column.accessor("expiresAt", {
      meta: { label: "Expires" },

      cell: CellHelpers.time,
    }),

    column.accessor("createdAt", {
      meta: { label: "Created" },

      cell: CellHelpers.time,
    }),
  ];
</script>

<DataTable
  {columns}
  data={invitations}
>
  {#snippet header(table)}
    <search class="flex flex-wrap gap-2">
      <Field label="Email">
        {#snippet input({ props })}
          <Input
            {...props}
            placeholder="Search by email"
            bind:value={
              () => table.getColumn("email")?.getFilterValue(),
              (v) => table.getColumn("email")?.setFilterValue(v)
            }
          />
        {/snippet}
      </Field>

      <Field label="Status">
        {#snippet input({ props })}
          <NativeSelect
            {...props}
            options={[
              { value: undefined, label: "All" },
              { value: "pending", label: "Pending" },
              { value: "accepted", label: "Accepted" },
              { value: "rejected", label: "Rejected" },
              { value: "expired", label: "Expired" },
            ]}
            bind:value={
              () => table.getColumn("status")?.getFilterValue(),
              (v) => table.getColumn("status")?.setFilterValue(v)
            }
          />
        {/snippet}
      </Field>
    </search>
  {/snippet}
</DataTable>

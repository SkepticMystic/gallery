<script lang="ts">
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Time from "$lib/components/ui/elements/Time.svelte";
  import { Format } from "$lib/utils/format.util.js";
  import InvitationTable from "./InvitationTable.svelte";
  import MemberTable from "./MemberTable.svelte";

  let { data } = $props();
  const org = data.organization;
</script>

<article>
  <header>
    <div class="space-y-2">
      <h1>{org.name}</h1>

      <Anchor
        href="/admin/organizations"
        icon="lucide/arrow-left"
      >
        Back to Organizations
      </Anchor>
    </div>
  </header>

  <section>
    <h2>Organization Details</h2>

    <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <dt class="text-sm font-medium text-muted-foreground">Name</dt>
        <dd class="mt-1 text-sm">{org.name}</dd>
      </div>

      <div>
        <dt class="text-sm font-medium text-muted-foreground">Slug</dt>
        <dd class="mt-1 text-sm">{org.slug}</dd>
      </div>

      <div>
        <dt class="text-sm font-medium text-muted-foreground">Created</dt>
        <dd class="mt-1 text-sm">
          <Time date={org.createdAt} />
        </dd>
      </div>

      <div>
        <dt class="text-sm font-medium text-muted-foreground">Updated</dt>
        <dd class="mt-1 text-sm">
          <Time date={org.updatedAt} />
        </dd>
      </div>

      <div>
        <dt class="text-sm font-medium text-muted-foreground">Total Members</dt>
        <dd class="mt-1 text-sm">{Format.number(org.members.length)}</dd>
      </div>

      <div>
        <dt class="text-sm font-medium text-muted-foreground">
          Pending Invitations
        </dt>
        <dd class="mt-1 text-sm">
          {Format.number(
            org.invitations.filter((i) => i.status === "pending").length,
          )}
        </dd>
      </div>
    </dl>
  </section>

  <section>
    <h2>Members ({Format.number(org.members.length)})</h2>

    <MemberTable members={org.members} />
  </section>

  <section>
    <h2>Invitations ({Format.number(org.invitations.length)})</h2>

    <InvitationTable invitations={org.invitations} />
  </section>
</article>

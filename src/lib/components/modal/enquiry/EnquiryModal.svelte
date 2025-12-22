<script lang="ts">
  import EnquiryForm from "$lib/components/form/enquiry/EnquiryForm.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Modal from "$lib/components/ui/modal/modal.svelte";
  import type { ResourceKey } from "$lib/schema/resource/resource.schema";

  let { resource_id, resource_kind }: ResourceKey = $props();
</script>

<Modal
  title="Enquire about {resource_kind}"
  description="Send an enquiry to the gallery owner"
>
  {#snippet trigger_child({ props })}
    <Button
      {...props}
      icon="lucide/mail"
    >
      Enquire
    </Button>
  {/snippet}

  {#snippet content({ close })}
    <EnquiryForm
      {resource_id}
      {resource_kind}
      on_success={close}
    />
  {/snippet}
</Modal>

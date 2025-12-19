<script lang="ts">
  import FieldError from "$lib/components/ui/field/field-error.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import type { ResourceKind } from "$lib/const/resource/resource.const";
  import { create_enquiry_remote } from "$lib/remote/enquiry/enquiry.remote";
  import { session } from "$lib/stores/session.store";
  import { onDestroy } from "svelte";
  import { toast } from "svelte-sonner";
  import FormButton from "../FormButton.svelte";

  let {
    resource_id,
    resource_kind,
    on_success,
  }: {
    resource_id: string;
    resource_kind: ResourceKind;
    on_success?: () => void;
  } = $props();

  const form = create_enquiry_remote;

  const session_listener = session.subscribe(($session) => {
    if ($session.data?.user) {
      form.fields.name.set($session.data.user.name);
      form.fields.email.set($session.data.user.email);

      try {
        session_listener();
      } catch (error) {
        console.log("session_listener.error", error);
      }
    }
  });

  onDestroy(() => {
    try {
      session_listener();
    } catch (error) {
      console.log("session_listener.error", error);
    }
  });
</script>

<form
  class="space-y-3"
  {...form.enhance(async (e) => {
    await e.submit();

    const res = form.result;
    console.log("form.fields.allIssues()", form.fields.allIssues());

    if (res?.ok) {
      toast.success("Enquiry submitted");

      e.form.reset();

      on_success?.();
    } else if (res?.error) {
      toast.error(res.error.message);
    }
  })}
>
  <input {...form.fields.resource_id.as("hidden", resource_id)} />
  <input {...form.fields.resource_kind.as("hidden", resource_kind)} />

  <Field
    label="Name"
    orientation="responsive"
    field={form.fields.name}
  >
    {#snippet input({ props, field })}
      <Input
        {...props}
        {...field?.as("text")}
        required
        class="sm:min-w-[300px]"
      />
    {/snippet}
  </Field>

  <Field
    label="Email"
    orientation="responsive"
    field={form.fields.email}
  >
    {#snippet input({ props, field })}
      <Input
        {...props}
        {...field?.as("email")}
        required
        class="sm:min-w-[300px]"
      />
    {/snippet}
  </Field>

  <Field
    label="Message"
    orientation="responsive"
    field={form.fields.message}
  >
    {#snippet input({ props, field })}
      <Textarea
        {...props}
        {...field?.as("text")}
        required
        class="min-h-32 resize-none sm:max-w-[500px] sm:min-w-[300px]"
      />
    {/snippet}
  </Field>

  <FormButton
    {form}
    class="w-full"
  >
    Send enquiry
  </FormButton>

  <FieldError errors={form.fields.allIssues()} />
</form>

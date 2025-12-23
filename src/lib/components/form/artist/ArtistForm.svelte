<script lang="ts">
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import FieldGroup from "$lib/components/ui/field/field-group.svelte";
  import FieldSeparator from "$lib/components/ui/field/field-separator.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Fieldset from "$lib/components/ui/field/Fieldset.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { upsert_artist_remote } from "$lib/remote/artist/artist.remote";
  import type { ArtistSchema } from "$lib/server/db/models/artist.model";
  import { toast } from "svelte-sonner";
  import FormButton from "../FormButton.svelte";

  let props:
    | { mode: "create" }
    | {
        mode: "update";
        initial: ArtistSchema["update"];
      } = $props();

  const form = upsert_artist_remote;

  if (props.mode === "update") {
    form.fields.set(props.initial);
  }
  $effect(() => {
    if (props.mode === "update") {
      form.fields.set(props.initial);
    }
  });
</script>

<form
  {...form.enhance(async (e) => {
    console.log("form.enhance.e", e);
    await e.submit();

    console.log("issues", form.fields.issues());
    console.log("allIssues", form.fields.allIssues());

    const res = form.result;
    console.log("form.result", res);

    if (res && !res.ok) {
      toast.error(res.error.message);
    }
  })}
>
  <Fieldset legend="Artist details">
    <FieldSeparator />

    <FieldGroup>
      {#if props.mode === "update"}
        <input {...form.fields.id.as("hidden", props.initial.id)} />
      {/if}

      <Field
        label="Name *"
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
        label="Bio"
        orientation="responsive"
        field={form.fields.description}
      >
        {#snippet description()}
          You can use
          <Anchor
            target="_blank"
            href="https://www.markdownguide.org/cheat-sheet/"
          >
            markdown
          </Anchor> to format your text.
        {/snippet}

        {#snippet input({ props, field })}
          <Textarea
            {...props}
            {...field?.as("text")}
            placeholder="A short description of the artist"
            class="max-h-96 min-h-32 resize-none sm:max-w-[500px] sm:min-w-[300px]"
          />
        {/snippet}
      </Field>

      <FormButton
        {form}
        class="w-full"
      />
    </FieldGroup>
  </Fieldset>
</form>

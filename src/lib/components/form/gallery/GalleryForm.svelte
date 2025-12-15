<script lang="ts">
  import TelInput from "$lib/components/input/tel/TelInput.svelte";
  import UrlInput from "$lib/components/input/url/UrlInput.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import FieldGroup from "$lib/components/ui/field/field-group.svelte";
  import FieldSeparator from "$lib/components/ui/field/field-separator.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Fieldset from "$lib/components/ui/field/Fieldset.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { upsert_gallery_remote } from "$lib/remote/gallery/gallery.remote";
  import type { GallerySchema } from "$lib/server/db/models/gallery.model";
  import { toast } from "svelte-sonner";
  import FormButton from "../FormButton.svelte";
  import GooglePlacesInput from "../place/GooglePlacesInput.svelte";

  let props:
    | { mode: "create" }
    | {
        mode: "update";
        initial: GallerySchema["update"];
      } = $props();

  const form = upsert_gallery_remote;

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
  <Fieldset legend="Gallery details">
    <FieldSeparator />

    <FieldGroup>
      {#if props.mode === "update"}
        <input {...form.fields.id.as("hidden", props.initial.id)} />
      {/if}

      <Field
        label="Name *"
        orientation="responsive"
        field={form.fields.name}
        description="This is how your gallery will be listed to the public."
      >
        {#snippet input({ props, field })}
          <Input
            {...props}
            {...field?.as("text")}
            required
            class="sm:min-w-[300px]"
            autocomplete="organization"
          />
        {/snippet}
      </Field>

      <Field
        label="Logo URL"
        orientation="responsive"
        field={form.fields.logo}
        description="A link to your logo"
      >
        {#snippet input({ props, field })}
          {#if field}
            <UrlInput
              {...props}
              {...field.as("text")}
              class="sm:min-w-[300px]"
              placeholder="example.com/logo.png"
            />
          {/if}
        {/snippet}
      </Field>

      <Field
        label="Email address"
        orientation="responsive"
        field={form.fields.emails[0]!.data}
        description="Your gallery's email address"
      >
        {#snippet input({ props, field })}
          <Input
            {...props}
            {...field?.as("email")}
            icon="lucide/mail"
            align="inline-start"
            class="sm:min-w-[300px]"
            autocomplete="work email"
            placeholder="gallery@example.com"
          />
        {/snippet}
      </Field>

      <Field
        label="Phone number"
        orientation="responsive"
        field={form.fields.phones[0]!.data}
        description="Your gallery's phone number, so customers can reach you."
      >
        {#snippet input({ props, field })}
          {#if field}
            <TelInput
              {...props}
              {...field.as("tel")}
              class="sm:min-w-[300px]"
            />
          {/if}
        {/snippet}
      </Field>

      <Field
        label="Website"
        orientation="responsive"
        field={form.fields.urls[0]!.data}
        description="Your gallery's website, or a link to your social media account."
      >
        {#snippet input({ props, field })}
          {#if field}
            <UrlInput
              {...props}
              {...field.as("text")}
              class="sm:min-w-[300px]"
              placeholder="example.com"
            />
          {/if}
        {/snippet}
      </Field>

      <Field
        label="Address"
        orientation="responsive"
        description="Where is your gallery located? If you have a Google Business, you can search for the address using your gallery's name."
      >
        {#snippet input({ props: snippet_props })}
          <input
            class="hidden"
            {...form.fields.google_place_id.as("text")}
          />
          <input
            class="hidden"
            {...form.fields.formatted_address.as("text")}
          />
          <input
            class="hidden"
            {...form.fields.coord_lat.as("number")}
          />
          <input
            class="hidden"
            {...form.fields.coord_lng.as("number")}
          />

          <GooglePlacesInput
            {...snippet_props}
            google_place_id={form.fields.google_place_id.value()}
            formatted_address={form.fields.formatted_address.value()}
            on_change={(data) => {
              form.fields.coord_lat.set(data.coord_lat);
              form.fields.coord_lng.set(data.coord_lng);
              form.fields.google_place_id.set(data.google_place_id);
              form.fields.formatted_address.set(data.formatted_address ?? "");
            }}
          />
        {/snippet}
      </Field>

      <Field
        label="Bio"
        orientation="responsive"
        field={form.fields.description}
      >
        {#snippet description()}
          Tell your customers what your gallery is about. <br />
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
            placeholder="A short description of your gallery"
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

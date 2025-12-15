<script lang="ts">
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import FieldGroup from "$lib/components/ui/field/field-group.svelte";
  import FieldSeparator from "$lib/components/ui/field/field-separator.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Fieldset from "$lib/components/ui/field/Fieldset.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import NativeSelect from "$lib/components/ui/native-select/native-select.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { list_my_galleries_remote } from "$lib/remote/gallery/gallery.remote";
  import { upsert_piece_remote } from "$lib/remote/piece/piece.remote";
  import type { PieceSchema } from "$lib/server/db/models/piece.model";
  import { result } from "$lib/utils/result.util";
  import { toast } from "svelte-sonner";
  import FormButton from "../FormButton.svelte";

  let props:
    | {
        mode: "create";
        initial?: Partial<Pick<PieceSchema["insert"], "gallery_id">>;
      }
    | {
        mode: "update";
        initial: PieceSchema["update"];
      } = $props();

  const form = upsert_piece_remote;

  const galleries = list_my_galleries_remote();

  if (props.mode === "update") {
    form.fields.set(props.initial);
  } else if (props.initial) {
    if (props.initial.gallery_id) {
      form.fields.gallery_id.set(props.initial.gallery_id);
    }
  }
  $effect(() => {
    if (props.mode === "update") {
      form.fields.set(props.initial);
    } else if (props.initial) {
      if (props.initial.gallery_id) {
        form.fields.gallery_id.set(props.initial.gallery_id);
      }
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

    if (res && !res.ok) {
      toast.error(res.error.message);
    }
  })}
>
  <Fieldset legend="Piece details">
    <FieldSeparator />

    <FieldGroup>
      {#if props.mode === "update"}
        <input {...form.fields.id.as("hidden", props.initial.id)} />
      {/if}

      <Field
        label="Title *"
        orientation="responsive"
        field={form.fields.name}
        description="This is how your piece will be listed to the public."
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

      {#if galleries.current?.ok}
        {#if galleries.current.data.length > 1}
          <Field
            label="Gallery *"
            orientation="responsive"
            field={form.fields.gallery_id}
            description="Which of your galleries is the piece at, currently?"
          >
            {#snippet input({ props, field })}
              <NativeSelect
                {...props}
                {...field?.as("select")}
                required
                class="sm:min-w-[300px]"
                options={result.unwrap_or(galleries.current, []).map((g) => ({
                  value: g.id,
                  label: g.name,
                }))}
              />
            {/snippet}
          </Field>
        {:else}
          <input
            {...form.fields.gallery_id.as(
              "hidden",
              galleries.current.data[0]?.id ?? "",
            )}
          />
        {/if}
      {/if}

      <Field
        label="Medium *"
        orientation="responsive"
        field={form.fields.medium}
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

      <FieldGroup>
        <Field
          label="Width (cm)"
          orientation="responsive"
          field={form.fields.width_cm}
        >
          {#snippet input({ props, field })}
            <Input
              {...props}
              {...field?.as("number")}
              step={0.01}
              class="sm:min-w-[300px]"
            />
          {/snippet}
        </Field>

        <Field
          label="Height (cm)"
          orientation="responsive"
          field={form.fields.height_cm}
        >
          {#snippet input({ props, field })}
            <Input
              {...props}
              {...field?.as("number")}
              step={0.01}
              class="sm:min-w-[300px]"
            />
          {/snippet}
        </Field>

        <Field
          label="Depth (cm)"
          orientation="responsive"
          field={form.fields.depth_cm}
        >
          {#snippet input({ props, field })}
            <Input
              {...props}
              {...field?.as("number")}
              step={0.01}
              class="sm:min-w-[300px]"
            />
          {/snippet}
        </Field>

        <FieldSeparator />

        <Field
          label="Weight (kg)"
          orientation="responsive"
          field={form.fields.weight_kg}
        >
          {#snippet input({ props, field })}
            <Input
              {...props}
              {...field?.as("number")}
              step={0.01}
              class="sm:min-w-[300px]"
            />
          {/snippet}
        </Field>

        <FieldSeparator />

        <Field
          label="Year created"
          orientation="responsive"
          field={form.fields.year_created}
        >
          {#snippet input({ props, field })}
            <Input
              {...props}
              {...field?.as("number")}
              class="sm:min-w-[300px]"
            />
          {/snippet}
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field
          label="Price"
          orientation="responsive"
          field={form.fields.price_cents}
        >
          {#snippet input({ props, field })}
            {@const { value, ...field_props } = field!.as("number")}
            <Input
              {...props}
              {...field_props}
              addon="R"
              align="inline-start"
              class="sm:min-w-[300px]"
              step={0.01}
              value={Number(value) / 100}
            />
          {/snippet}
        </Field>
      </FieldGroup>

      <Field
        label="Description"
        orientation="responsive"
        field={form.fields.description}
      >
        {#snippet description()}
          Tell your customers what this piece is about. <br />
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
            placeholder="A short description of the piece"
            class="min-h-32 resize-none sm:max-w-[500px] sm:min-w-[300px]"
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

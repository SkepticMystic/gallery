<script lang="ts">
  import ExtractSnippet from "$lib/components/util/ExtractSnippet.svelte";
  import type { MaybeSnippet } from "$lib/interfaces/svelte/svelte.types";
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";
  import CardContent from "./card-content.svelte";
  import CardDescription from "./card-description.svelte";
  import CardFooter from "./card-footer.svelte";
  import CardHeader from "./card-header.svelte";
  import CardRoot from "./card-root.svelte";
  import CardTitle from "./card-title.svelte";

  let {
    title,
    description,
    class: klass,

    content,
    footer,
  }: {
    class?: ClassValue;
    title?: MaybeSnippet;
    description?: MaybeSnippet;

    content: MaybeSnippet;
    footer?: Snippet;
  } = $props();
</script>

<CardRoot class={klass}>
  {#if title || description}
    <CardHeader>
      {#if title}
        <CardTitle>
          <ExtractSnippet snippet={title} />
        </CardTitle>
      {/if}

      {#if description}
        <CardDescription>
          <ExtractSnippet snippet={description} />
        </CardDescription>
      {/if}
    </CardHeader>
  {/if}

  <CardContent>
    <ExtractSnippet snippet={content} />
  </CardContent>

  {#if footer}
    <CardFooter>
      {@render footer?.()}
    </CardFooter>
  {/if}
</CardRoot>

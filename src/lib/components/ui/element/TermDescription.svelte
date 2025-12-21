<script lang="ts">
  import ExtractSnippet from "$lib/components/util/ExtractSnippet.svelte";
  import type { MaybeSnippet } from "$lib/interfaces/svelte/svelte.types";
  import type { ClassValue } from "svelte/elements";
  import Icon from "../icon/Icon.svelte";

  let {
    icon,
    term,
    description,
    sr_only = false,
    class: klass = "",
  }: {
    icon?: string;
    term: MaybeSnippet;
    description: MaybeSnippet;
    sr_only?: boolean;
    class?: ClassValue;
  } = $props();
</script>

<div class={["flex flex-col gap-1", klass]}>
  <dt
    class={[
      sr_only
        ? "sr-only"
        : "flex items-center gap-1 text-sm font-medium text-muted-foreground",
    ]}
  >
    <Icon {icon} />
    <ExtractSnippet snippet={term} />
  </dt>
  <dd>
    <ExtractSnippet snippet={description} />
  </dd>
</div>

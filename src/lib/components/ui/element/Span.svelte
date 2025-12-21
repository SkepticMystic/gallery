<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  let {
    content,
    ...rest
  }: {
    content?: string;
  } & HTMLAttributes<HTMLSpanElement> = $props();
</script>

<span {...rest}>
  {content}
</span>

<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import type { ComponentProps } from "svelte";

  let { value, ...rest }: ComponentProps<typeof Input> = $props();
</script>

<Input
  inputmode="url"
  addon="https://"
  align="inline-start"
  value={typeof value === "string" && value.startsWith("https://")
    ? value.slice(8)
    : value}
  {...rest}
/>

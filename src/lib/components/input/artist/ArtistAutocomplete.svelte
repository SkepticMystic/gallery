<script lang="ts">
  import AutocompleteHighlight from "$lib/components/ui/autocomplete/autocomplete-highlight.svelte";
  import Autocomplete from "$lib/components/ui/autocomplete/autocomplete.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { ResultData } from "$lib/interfaces/result.type";
  import { search_artists_remote } from "$lib/remote/artist/artist.remote";
  import { result } from "$lib/utils/result.util";
  import { Debounced } from "runed";
  import type { ComponentProps } from "svelte";

  type TData = ResultData<
    NonNullable<Awaited<ReturnType<typeof search_artists_remote>>>
  >[number];

  let {
    value,
    on_select,
    ...rest
  }: {
    value?: string | number | undefined;
    on_select?: (artist: TData) => void;
  } & Omit<ComponentProps<typeof Input>, "value"> = $props();

  const debounced = new Debounced(() => value?.toString(), 500);

  const artists = $derived(
    search_artists_remote({
      where: { normalized_name: { ilike: debounced.current } },
    }),
  );
</script>

<Autocomplete
  {...rest}
  loading={artists.loading}
  options={result.unwrap_or(artists.current, [])}
  onSelect={(artist) => {
    value = artist.name;
    debounced.cancel();

    on_select?.(artist);
  }}
  bind:value={() => value?.toString() ?? "", (v) => (value = v)}
>
  {#snippet itemSnippet(artist)}
    <AutocompleteHighlight
      text={artist.name}
      query={value?.toString() ?? ""}
    />
  {/snippet}

  {#snippet emptySnippet()}
    No artists found. Enter their name, and we'll create a new artist for you.
  {/snippet}
</Autocomplete>

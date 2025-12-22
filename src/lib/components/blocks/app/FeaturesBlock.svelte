<script lang="ts">
  import Card from "$lib/components/ui/card/Card.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";

  const FEATURES: {
    icon: string;
    title: string;
    content: string;
    description?: string;
  }[] = [
    {
      icon: "lucide/gallery-horizontal",
      title: "Showcase Your Collection",
      content:
        "Display your gallery's artwork with beautiful, organized listings. Upload images, add details, and create a stunning online presence.",
    },
    {
      icon: "lucide/map-pin",
      title: "Connect with Collectors",
      content:
        "Make it easy for art enthusiasts to discover your gallery and inquire about pieces. Build relationships with collectors in your area.",
    },
    {
      icon: "lucide/sparkles",
      title: "Manage with Ease",
      content:
        "Update your inventory, track inquiries, and manage multiple galleries from one simple dashboard. Focus on art, not administration.",
    },
  ];
</script>

<div class="grid gap-x-4 gap-y-4 md:grid-cols-3">
  {#each FEATURES as feat (feat.title)}
    <Card content={feat.content}>
      {#snippet title()}
        <Icon
          icon={feat.icon}
          label={feat.title}
        />
      {/snippet}
    </Card>
  {/each}
</div>

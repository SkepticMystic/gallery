<script lang="ts">
  import FormButton from "$lib/components/form/FormButton.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import { PAYSTACK } from "$lib/const/payment/paystack/paystack.payment.const";
  import { paystack_initialize_transaction_remote } from "$lib/remote/payment/paystack/paystack.payment.remote";
</script>

<div class="flex flex-wrap gap-3">
  {#each PAYSTACK.PLANS.LIST as plan (plan.planCode)}
    {@const form = paystack_initialize_transaction_remote.for(plan.name)}

    <Card title={plan.name}>
      {#snippet content()}
        <pre>{JSON.stringify(plan, null, 2)}</pre>
      {/snippet}

      {#snippet footer()}
        <form
          {...form.enhance(async (e) => {
            await e.submit();

            console.log("res", form.result);
          })}
        >
          <input {...form.fields.plan.as("hidden", plan.name)} />

          <FormButton
            {form}
            icon="lucide/credit-card"
          >
            Upgrade
          </FormButton>
        </form>

        <!-- <Button
          onclick={() => SubscriptionClient.subscribe({ plan: plan.name })}
        >
          Upgrade
        </Button> -->
      {/snippet}
    </Card>
  {/each}
</div>

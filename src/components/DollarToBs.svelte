<script>
    import { onMount } from "svelte";

    let tasaDolar = null;
    let loading = true;
    let error = null;

    const formattedAmount = (amount) => amount.toFixed(2);

    onMount(async () => {
        try {
            const response = await fetch("/data/exchangeRate.json");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            tasaDolar = data.tasa; // Update the reactive variable
        } catch (e) {
            console.error("Failed to fetch exchange rate:", e);
            error = "Could not load exchange rate."; // Update the reactive variable
        } finally {
            loading = false; // Update the reactive variable
        }
    });
</script>

{#if loading}
    <p>Loading exchange rate...</p>
{:else if error}
    <p style="color: red;">{error}</p>
{:else if tasaDolar !== null}
    <h5>
        Monto a pagar: <span class="font-bold">
            {formattedAmount(tasaDolar * 25)} Bs
        </span>
    </h5>
{:else}
    <p>Exchange rate not available.</p>
{/if}

<script lang="ts">
    let monto: number = $props();

    let tasaDolar = $state(0);
    let loading = $state(true);
    let error = $state("");

    const formattedAmount = (amount: number) => amount.toFixed(2);

    $effect(() => {
        const fetchData = async () => {
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
        };

        fetchData();
    });
</script>

{#if loading}
    <p>Cargando total...</p>
{:else if error}
    <p style="color: red;">{error}</p>
{:else if tasaDolar !== null}
    <span class="font-bold">
        {formattedAmount(tasaDolar * monto.monto)} Bs
    </span>
{:else}
    <p>Cambio no disponible.</p>
{/if}

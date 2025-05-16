<script lang="ts">
    interface FacturaData {
        fecha_emision: string;
        fecha_vencimiento: string;
        total: number;
    }

    let { debt }: { debt: [] } = $props();
    let tasaDolar = $state(null);
    let loading = $state(true);
    let error = $state("");

    let fecha: string[] = [];
    let montos: number[] = [];

    if (debt.length >= 1) {
        debt.map((i: FacturaData) => {
            fecha.push(i.fecha_emision);
            montos.push(i.total);
        });
    }

    const formattedAmount = (amount: number) => amount.toFixed(2);

    function add(accumulator: number, a: number) {
        return accumulator + a;
    }

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
    <p>Loading exchange rate...</p>
{:else if error}
    <p style="color: red;">{error}</p>
{:else if tasaDolar !== null}
    {#if montos.length <= 1}
        <p>Usted no posee facturas vencidas</p>
    {:else}
        <p>Facturas vencidas: {montos.length}</p>
        <h5>
            Monto a pagar: <span class="font-bold">
                {formattedAmount(tasaDolar * montos.reduce(add, 0))} Bs
            </span>
        </h5>
    {/if}
{:else}
    <p>Exchange rate not available.</p>
{/if}

<script>
    import { actions } from "astro:actions";
    import ConsultaDeuda from "./ConsultaDeuda.svelte";
    let cedula = $state("");
    let userData = $state("");
    let error = $state(null);
    let loading = $state(false);

    async function handleSubmit(e) {
        e.preventDefault();
        loading = true;
        userData = "";
        error = "";

        const result = await actions.getUserDebt({ cedula });

        loading = false;

        if (result) {
            userData = result.data.results[0];
        } else if (result && result.error) {
            // Error de validación de Zod o error retornado por el handler
            let errorMessage = "Error desconocido.";
            if (result.error.fields) {
                // Errores de validación de Zod
                errorMessage = Object.entries(result.error.fields)
                    .map(([field, errors]) => `${field}: ${errors?.join(", ")}`)
                    .join("; ");
            } else if (result.error.message) {
                // Error retornado por el handler
                errorMessage = result.error.message;
            }
            error = `Error: ${errorMessage}`;
        } else {
            error = "Ocurrió un error inesperado al procesar la solicitud.";
        }
    }
</script>

<form
    onsubmit={handleSubmit}
    method="get"
    class="flex flex-col mx-auto w-full lg:w-1/3 md:w-2/3 sm:w-3/4 sm:h-2/4 h-full sm:mb-8 p-8 justify-center bg-white border border-gray-200 rounded-lg shadow-sm"
>
    <h2 class="text-lg sm:text-2xl font-bold mx-auto mb-8">
        Consulta Si Tienes Deuda
    </h2>
    <label class="mb-2 text-sm font-semibold" for="cedula">Cédula o RIF</label>
    <input
        class="mb-4 rounded-lg border-gray-300"
        type="text"
        id="cedula"
        placeholder="V12345678 | 12345678"
        bind:value={cedula}
        required
    />
    <button
        type="submit"
        disabled={loading}
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5"
        >{loading ? "Consultando..." : "Consultar"}</button
    >
    {#if error}
        <p>{error}</p>
    {/if}
</form>
{#if userData}
    <div class="h-full w-full absolute bg-black opacity-35"></div>
    <div
        class="absolute w-1/3 h-2/3 bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex flex-col justify-between"
    >
        <h5>Hola {userData.nombre}</h5>

        <span><ConsultaDeuda debt={userData.saldo} /></span>
        <div class="w-full">
            {#if userData.saldo > 0}
                <button
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5"
                    >Pagar</button
                >
            {/if}
            <button
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5"
                onclick={() => {
                    userData = "";
                }}>Cerrar</button
            >
        </div>
    </div>
{/if}

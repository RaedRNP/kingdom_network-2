<script>
    import { actions } from "astro:actions";
    import ConsultaDeuda from "./ConsultaDeuda.svelte";
    let cedula = $state("");
    let userData = $state("");
    let error = $state(null);
    let loading = $state(false);
    let selected = $state("");

    function handleErrorInCedula(ci) {
        if (!Number(ci)) {
            error = "Este campo solo debe contener números.";
            loading = false;
            throw new Error("error");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        loading = true;
        userData = "";
        error = "";

        handleErrorInCedula(cedula);

        let identity = selected + cedula;

        const result = await actions.getUserDebt({ cedula: identity });

        loading = false;

        if (result && !result.data.error) {
            let nombre = result.data.usuario.results[0].nombre;
            let facturas = result.data.facturas.facturas;

            if (facturas.length == 0) {
                userData = {
                    nombre,
                    deuda: 0,
                };
            } else {
                userData = {
                    nombre,
                    deuda: facturas,
                    userUrl: result.data.usuario.results[0].id_servicio,
                };
            }
        } else if (result && result.data.error) {
            // Error de validación de Zod o error retornado por el handler
            error = `${result.data.error}`;
        } else {
            error = "Ocurrió un error inesperado al procesar la solicitud.";
        }
    }
</script>

<form
    onsubmit={handleSubmit}
    method="get"
    class="flex flex-col mx-auto w-full lg:w-1/3 md:w-2/3 sm:w-3/4 sm:-min-h-2/4 h-full sm:mb-8 p-8 justify-center bg-white border border-gray-200 rounded-lg shadow-sm"
>
    <h2 class="text-lg sm:text-2xl font-bold mx-auto mb-8">
        Consulta Si Tienes Deuda
    </h2>
    <label class="mb-2 text-sm font-semibold" for="cedula">Cédula o RIF</label>
    <select
        bind:value={selected}
        class="mb-4 rounded-lg border-gray-300"
        required
    >
        <option value="V-">V</option>
        <option value="E-">E</option>
        <option value="J-">J</option>
    </select>
    <input
        class="mb-4 rounded-lg border-gray-300"
        type="text"
        id="cedula"
        placeholder="12345678"
        bind:value={cedula}
        required
    />
    {#if error}
        <p class="text-red-500 mb-4">{error}</p>
    {/if}
    <button
        type="submit"
        disabled={loading}
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5"
        >{loading ? "Consultando..." : "Consultar"}</button
    >
</form>
{#if userData}
    <div class="h-full w-full absolute bg-black opacity-35"></div>
    <div
        class="absolute w-11/12 sm:w-1/2 md:w-2/3 lg:w-1/3 h-2/3 bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex flex-col justify-between"
    >
        <div>
            <h5 class="text-lg mb-1 text-center">
                ¡Hola <span class="font-semibold">{userData.nombre}</span>!
            </h5>
            <span class="block w-full h-[1px] bg-gray-300"></span>
        </div>

        <span><ConsultaDeuda debt={userData.deuda} /></span>
        <div class="w-full flex gap-2 items-center justify-around">
            <button
                class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5"
                onclick={() => {
                    userData = "";
                }}>Cerrar</button
            >
            {#if userData.deuda.length > 0}
                <a
                    href={`/portal-pago/${userData.userUrl}`}
                    class="flex items-center justify-center w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5"
                    >Pagar</a
                >
            {/if}
        </div>
    </div>
{/if}

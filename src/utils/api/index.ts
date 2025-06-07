import type { ResponseCedulaFilter } from "../classes/ResponseCedulaFilter";

const WISPHUB_URL = import.meta.env.WISPHUB_URL;
const APIKEY = import.meta.env.WISPHUB_APIKEY;

const getUser = async (ci: string) => {
  let path = `/api/clientes/?cedula=${ci}`;
  let url = new URL(path, WISPHUB_URL);

  try {
    // console.log("Fetching URL:", url.toString()); // Log the URL being fetched
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Api-Key ${APIKEY}`,
      },
    });
    // console.log("Fetch response status:", response.status); // Log the response status
    let jsonResponse = await response.json();

    if (jsonResponse.results.length < 1) {
      // Check for non-OK status codes (400-599)
      return new Response(
        JSON.stringify({ success: false, error: "Usuario no encontrado" }),
        { status: 404 },
      );
    }
    let facturas = await getDebt(jsonResponse);
    return { usuario: jsonResponse, facturas };
  } catch (e) {
    throw new Error(`Error al hacer fetch en la api`);
  }
};

const getDebt = async (usuario: ResponseCedulaFilter) => {
  let servicio = usuario.results[0].id_servicio;
  let path = `/api/clientes/${servicio}/saldo`;
  let url = new URL(path, WISPHUB_URL);

  try {
    const facturas = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Api-Key ${APIKEY}`,
      },
    });
    if (!facturas.ok) {
      return { error: "Error en la busqueda de facturas" };
    }

    return facturas.json();
  } catch (e) {
    return { error: `Error er ${e}` };
  }
};

const getUserByIdService = async (id: string | number) => {
  let path = `/api/clientes/${id}/saldo`;
  let url = new URL(path, WISPHUB_URL);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Api-Key ${APIKEY}`,
      },
    });
    const data = await response.json();
    if (!data) {
      return { error: "Error en la busqueda de usuario" };
    }
    return data;
  } catch (e) {
    return { error: `Error er ${e}` };
  }
};

export { getUser, getUserByIdService };

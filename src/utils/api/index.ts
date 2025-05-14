const getUser = async (ci: string) => {
  const WISPHUB_URL = import.meta.env.WISPHUB_URL;
  let path = `/api/clientes/?cedula=${ci}`;
  let url = new URL(path, WISPHUB_URL);
  const APIKEY = import.meta.env.WISPHUB_APIKEY;

  try {
    console.log("Fetching URL:", url.toString()); // Log the URL being fetched
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Api-Key ${APIKEY}`,
      },
    });
    console.log("Fetch response status:", response.status); // Log the response status
    if (!response.ok) {
      // Check for non-OK status codes (400-599)
      return {
        error: `Usuario no encontrado o error en la API: ${response.status}`,
      };
    }
    return response.json();
  } catch (e) {
    throw new Error(`Error al hacer fetch en la api: ${e}`);
  }
};

export default { getUser };

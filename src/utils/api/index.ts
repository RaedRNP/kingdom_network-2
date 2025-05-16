interface ResponseCedulaFilter {
  count: number;
  next: number | null;
  previous: number | null;
  results: [
    {
      id_servicio: number;
      usuario: string;
      nombre: string;
      email: string;
      cedula: string;
      direccion: string;
      localidad: string;
      ciudad: string;
      telefono: string;
      descuento: string;
      saldo: string;
      rfc: string;
      informacion_adicional: string | null;
      notificacion_sms: boolean;
      aviso_pantalla: boolean;
      notificaciones_push: boolean;
      auto_activar_servicio: boolean;
      firewall: boolean;
      servicio: string;
      password_servicio: string;
      server_hotspot: string;
      ip: string;
      ip_local: string | null;
      estado: string;
      modelo_antena: string | null;
      password_cpe: string;
      mac_cpe: string;
      interfaz_lan: string;
      modelo_router_wifi: string;
      ip_router_wifi: string | null;
      mac_router_wifi: string;
      usuario_router_wifi: string;
      password_router_wifi: string;
      ssid_router_wifi: string;
      password_ssid_router_wifi: string;
      comentarios: string;
      coordenadas: string;
      costo_instalacion: string;
      precio_plan: string;
      forma_contratacion: string;
      sn_onu: string;
      estado_facturas: string;
      fecha_instalacion: Date;
      fecha_cancelacion: Date | null;
      fecha_corte: Date;
      ultimo_cambio: Date;
      plan_internet: {
        id: number;
        nombre: string;
      };
      zona: {
        id: number;
        nombre: string;
      };
      router: {
        id: number;
        nombre: string;
        falla_general: boolean;
        falla_general_descripcion: string;
      };
      sectorial: string | null;
      tecnico: string | null;
    },
  ];
}
const WISPHUB_URL = import.meta.env.WISPHUB_URL;
const APIKEY = import.meta.env.WISPHUB_APIKEY;

const getUser = async (ci: string) => {
  let path = `/api/clientes/?cedula=${ci}`;
  let url = new URL(path, WISPHUB_URL);

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
    let jsonResponse = await response.json();
    let facturas = await getDebt(jsonResponse);
    return { usuario: jsonResponse, facturas };
  } catch (e) {
    throw new Error(`Error al hacer fetch en la api: ${e}`);
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

export default { getUser };

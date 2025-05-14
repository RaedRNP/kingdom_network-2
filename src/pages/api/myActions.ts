import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.formData(); // o request.json()
    const cedula = data.get("cedula");

    // Lógica del servidor
    console.log("Datos recibidos en API Route:", { cedula });

    if (cedula === "error") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Error procesando la solicitud.",
        }),
        { status: 400 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Datos de ${cedula} recibidos.`,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: "Error interno del servidor." }),
      { status: 500 },
    );
  }
};

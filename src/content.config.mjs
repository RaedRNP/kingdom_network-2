import { defineCollection, z } from "astro:content";
import qs from "qs";
import Mockups from "./utils/mockups/mock-products.json";

const strapiProductosLoader = defineCollection({
  loader: async () => {
    const BASE_URL = import.meta.env.STRAPI_URL || "http://localhost:1337";
    const path = "/api/items";
    const url = new URL(path, BASE_URL);

    url.search = qs.stringify(
      {
        populate: {
          imagen: {
            fields: ["url", "alternativeText"],
          },
          category: {
            fields: ["name"],
          },
        },
      },
      { encodeValuesOnly: true },
    );

    try {
      const response = await fetch(url.href);
      if (!response.ok) {
        console.warn(
          `Failed to fetch data from Strapi (${response.status}: ${response.statusText}). Using mock data.`,
        );
        return Mockups;
      }
      const { data } = await response.json();

      if (!Array.isArray(data)) {
        console.error("La respuesta del servidor STRP no es un Array");
        console.warn("Usando datos del Mockup");
        return Mockups;
      }

      const mapData = data
        .map((item) => {
          if (!item.attribute) {
            console.warn("Saltando item sin atributo");
            return null;
          }

          const attribute = item.attribute;
          return data.map((item) => ({
            id: item.id.toString(),
            documentId: item.documentId,
            nombre: attribute.nombre,
            descripcion: attribute.descripcion,
            precio: attribute.precio,
            cantidad: attribute.cantidad,
            createdAt: attribute.createdAt,
            updatedAt: attribute.updatedAt,
            publishedAt: attribute.publishedAt,
            imagen:
              {
                id: attribute.imagen?.id || null,
                documentId: attribute.imagen?.documentId || null,
                url: attribute.imagen?.url || null,
                alternativeText: attribute.imagen?.alternativeText || null,
              } || null,
            category: {
              id: attribute.category.id,
              documentId: attribute.category.documentId,
              name: attribute.category.name,
            },
          }));
        })
        .filter((item) => item !== null);

      if (mapData.length === 0 && data.length > 0) {
        console.warn(
          "No valid items mapped from Strapi data. Check your mapping logic.",
        );
        console.warn("Using mock data as a fallback.");
        return Mockups;
      }
      console.log(
        `Successfully fetched and mapped ${mapData.length} items from Strapi.`,
      );
      return mapData;
    } catch (e) {
      console.error(e.message);
    }
    return Mockups;
  },
  schema: z.object({
    id: z.string(),
    documentId: z.string(),
    nombre: z.string(),
    descripcion: z.string().nullable(),
    precio: z.number(),
    cantidad: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    imagen: z.nullable(
      z.object({
        id: z.nullable(z.number()),
        documentId: z.nullable(z.string()),
        url: z.nullable(z.string()),
        alternativeText: z.nullable(z.string()),
      }),
    ),
    category: z.object({
      id: z.number(),
      documentId: z.string(),
      name: z.string(),
    }),
  }),
});

export const collections = {
  strapiProductosLoader,
};

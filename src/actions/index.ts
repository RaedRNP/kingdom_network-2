import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getUser, getUserByIdService } from "../utils/api/index";
import type { FormCI } from "../utils/classes/FormCI";

export const server = {
  getUserDebt: defineAction({
    accept: "json",
    input: z.object({
      cedula: z.string({ message: "Este campo debe ser llenado." }),
    }),

    handler: async (formData) => {
      const FormCI: FormCI = {
        data: {
          cedula: formData.cedula,
        },
      };
      try {
        const responseData = await getUser(FormCI.data.cedula);
        console.log(responseData);
        if (responseData.status === 404) {
          throw "Usuario no encontrado";
        }
        return responseData;
      } catch (e) {
        throw new Error(`${e}`);
      }
    },
  }),
  getUserById: defineAction({
    handler: async (id: string | number) => {
      try {
        const responseData = await getUserByIdService(id);
        if (responseData.status === 404) {
          throw "Usuario no encontrado Err: actions";
        }
        return responseData;
      } catch (e) {
        throw new Error(`${e}`);
      }
    },
  }),
};

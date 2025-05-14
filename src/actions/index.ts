import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import getUser from "../utils/api/index";

interface FormCI {
  data: {
    cedula: string;
  };
}

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
        const responseData = await getUser.getUser(FormCI.data.cedula);
        if (responseData.error) {
          return responseData.error;
        }
        return responseData;
      } catch (e) {
        throw new Error(`Error en la action: ${e}`);
      }
    },
  }),
};

// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// import node from "@astrojs/node";

import svelte from "@astrojs/svelte";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "server",

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),

  integrations: [svelte()],
});

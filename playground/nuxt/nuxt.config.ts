import NitroPublic from "nitro-public-module";

export default defineNuxtConfig({
  typescript: {
    shim: false,
  },
  nitro: {
    modules: [NitroPublic()],
  },
});

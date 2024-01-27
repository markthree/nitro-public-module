import type { NitroModule } from "nitropack";

const module: NitroModule = {
  name: "nitro-public",
  setup(nitro) {
    if (nitro.options.dev) {
      return;
    }
    console.log("hello world");
  },
};

export default module;

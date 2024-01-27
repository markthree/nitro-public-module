import type { NitroModule } from "nitropack";

const module: NitroModule = {
  name: "nitro-public",
  setup(nitro) {
    console.log("hello world");
  },
};

export default module;

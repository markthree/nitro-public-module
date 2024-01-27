import { watch } from "chokidar";

export default defineNitroModule({
  name: "restart",
  async setup(nitro) {
    watch("../src/**", { ignoreInitial: true }).once("all", () => {
      nitro.hooks.callHook("restart");
    });
  },
});

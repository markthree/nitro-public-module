import { watch } from "chokidar";

export default defineNitroModule({
  name: "restart",
  async setup(nitro) {
    const watcher = watch("../src/**", { ignoreInitial: true }).once(
      "all",
      () => {
        nitro.hooks.callHook("restart");
      },
    );

    nitro.hooks.hook("close", () => {
      watcher.close();
    });
  },
});

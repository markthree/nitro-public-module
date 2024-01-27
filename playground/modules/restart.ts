import { watch } from "chokidar";

export default defineNitroModule({
  name: "restart",
  async setup(nitro) {
    if (!nitro.options.dev) {
      return;
    }
    const watcher = watch(["../src/**", "../runtime/virtual/nitro-public.ts"], {
      ignoreInitial: true,
    }).once(
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

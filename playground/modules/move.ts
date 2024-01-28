import { resolve } from "path";
import { copyFile } from "fs/promises";

export default defineNitroModule({
  name: "move",
  setup(nitro) {
    if (nitro.options.dev) {
      return;
    }

    nitro.hooks.hook("compiled", async () => {
      await copyFile(
        resolve(nitro.options.output.dir, "../fixture/demo.jpg"),
        resolve(nitro.options.output.publicDir, "demo.jpg"),
      );
    });
  },
});

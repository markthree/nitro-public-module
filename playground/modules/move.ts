import { copyFile } from "fs/promises";
import { dirname, resolve } from "path";

export default defineNitroModule({
  name: "move",
  setup(nitro) {
    if (nitro.options.dev) {
      return;
    }
    console.log(nitro.options.output.dir);

    nitro.hooks.hook("compiled", async () => {
      await copyFile(
        resolve(nitro.options.output.dir, "../fixture/demo.jpg"),
        resolve(nitro.options.output.publicDir, "demo.jpg"),
      );
    });
  },
});

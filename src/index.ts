import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import { dirname, resolve } from "pathe";
import type { NitroModule } from "nitropack";

const _dirname = typeof __dirname !== "undefined"
  ? __dirname
  : dirname(fileURLToPath(import.meta.url));

const runtime = resolve(_dirname, "../runtime");

interface Options {
  preset?: "spa" | "ssg" | "fallback" | false;
}

const defaultOptions: Options = {
  preset: "fallback",
};

function nitroPublic(options: Options = defaultOptions): NitroModule {
  return {
    name: "nitro-public",
    setup(nitro) {
      useVirtual();

      if (isPresetDisabled()) {
        return;
      }

      useMiddleware(options.preset);

      function isPresetDisabled() {
        if (nitro.options.dev || options.preset === false) {
          return true;
        }

        if (!nitro.options.preset.includes("node")) {
          nitro.logger.withTag("nitro-public").withTag("preset").warn(
            "Only the node runtime is supported",
          );
          return true;
        }

        return false;
      }

      function useMiddleware(preset: Options["preset"] = "fallback") {
        if (preset === false) {
          return;
        }
        nitro.options.handlers ??= [];
        nitro.options.handlers.push({
          method: "GET",
          middleware: true,
          handler: resolve(runtime, `middleware/${preset}.ts`),
        });
      }

      function useVirtual() {
        nitro.options.virtual ??= {};
        nitro.options.typescript.tsConfig ??= {};
        nitro.options.typescript.tsConfig.compilerOptions ??= {};
        nitro.options.typescript.tsConfig.compilerOptions.paths ??= {};
        nitro.options.typescript.tsConfig.compilerOptions
          .paths["#nitro-public"] = [
            resolve(runtime, "virtual/nitro-public.d.ts"),
          ];
        nitro.options.virtual["#nitro-public"] = () => {
          const nitroPublic = resolve(runtime, "virtual/nitro-public.js");
          return readFile(nitroPublic, "utf8");
        };
      }
    },
  };
}

export default nitroPublic;

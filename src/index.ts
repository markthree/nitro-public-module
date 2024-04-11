import { defu } from "defu";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import { dirname, resolve } from "pathe";
import type { NitroModule } from "nitropack";

const _dirname = typeof __dirname !== "undefined"
  ? __dirname
  : dirname(fileURLToPath(import.meta.url));

const runtime = resolve(_dirname, "../runtime");

interface Options {
  /**
   * @default By default, it is automatically inferred
   */
  forcePresetEnabled?: boolean;
  /**
   * @default "fallback"
   */
  preset?: "spa" | "ssg" | "fallback" | false;
}

const defaultOptions: Options = {
  preset: "fallback",
};

function nitroPublic(options: Options = defaultOptions): NitroModule {
  return {
    name: "nitro-public",
    setup(nitro) {
      options = defu(options, defaultOptions);

      useVirtual();

      if (!isPresetEnabled()) {
        return;
      }

      useMiddleware(options.preset);

      function isPresetEnabled() {
        const { preset, forcePresetEnabled } = options;
        const { preset: nitroPreset, dev } = nitro.options;

        if (forcePresetEnabled !== undefined) {
          return forcePresetEnabled;
        }

        if (dev || preset === false) {
          return false;
        }

        const enabled = ["node", "deno", "bun"].some((runtime) => {
          return nitroPreset.includes(runtime);
        });

        if (!enabled) {
          const logger = nitro.logger.withTag("public");

          logger.warn(
            `The preset "${preset}" is not supported by the ${nitroPreset} runtime. Of course, you can also enable the forcePresetEnabled option to force it on`,
          );
        }

        return enabled;
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
        nitro.options.typescript.tsConfig.compilerOptions.paths[
          "#nitro-public"
        ] = [resolve(runtime, "virtual/nitro-public.d.ts")];
        nitro.options.virtual["#nitro-public"] = () => {
          const nitroPublic = resolve(runtime, "virtual/nitro-public.js");
          return readFile(nitroPublic, "utf8");
        };
      }
    },
  };
}

export default nitroPublic;

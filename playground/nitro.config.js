import jiti from "jiti";

function load(path) {
  // @ts-ignore
  return jiti(null, {
    esmResolve: true,
    interopDefault: true,
    requireCache: false,
  })(
    path,
  );
}

export default defineNitroConfig({
  modules: [load("../src/index.ts")],
});

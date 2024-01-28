import { createPublicFallbackMiddleware } from "#nitro-public";

export default createPublicFallbackMiddleware((p) => {
  return {
    file: p,
  };
});

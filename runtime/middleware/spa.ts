import { createPublicFallbackMiddleware } from "#nitro-public";

export default createPublicFallbackMiddleware(() => {
  return {
    file: "index.html",
    mime: "text/html",
  };
});

import { createPublicFallbackMiddleware } from "#nitro-public";

export default createPublicFallbackMiddleware(() => {
  return {
    file: "index.html",
    contentType: "text/html",
  };
});

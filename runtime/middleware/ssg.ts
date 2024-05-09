import { createPublicFallbackMiddleware } from "#nitro-public";

export default createPublicFallbackMiddleware((p) => {
  // maybe other file type
  if (p.includes(".") && !p.endsWith(".html")) {
    return {
      file: p,
    };
  }

  return {
    file: p.endsWith(".html") ? p : `${p}.html`,
    contentType: "text/html",
  };
});

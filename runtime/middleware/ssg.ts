import { createPublicFallbackMiddleware } from "../virtual/nitro-public";

export default createPublicFallbackMiddleware((p) => {
  return {
    file: p.endsWith(".html") ? p : `${p}.html`,
    mime: "text/html",
  };
});

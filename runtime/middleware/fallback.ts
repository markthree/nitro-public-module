import { lookup } from "mrmime";
import { basename, resolve } from "path";
import { publicDir } from "#nitro-public";
import { createReadStream, existsSync } from "fs";

const beforeResponse = defineResponseMiddleware(async (e) => {
  if (e.method !== "GET") {
    return;
  }
  const url = getRequestURL(e).pathname.slice(1);
  const noHandled = e.handled === false || getResponseStatus(e) === 404;
  const file = resolve(publicDir(), url);
  if (noHandled && existsSync(file)) {
    setResponseStatus(e, 200);
    setResponseHeader(e, "Content-Type", lookup(basename(file)));
    return sendStream(e, createReadStream(file));
  }
});

export default eventHandler({
  handler() {},
  onBeforeResponse: [beforeResponse],
});

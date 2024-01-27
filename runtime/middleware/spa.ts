import { resolve } from "path";
import { createReadStream } from "fs";
import { publicDir } from "#nitro-public";

const beforeResponse = defineResponseMiddleware(async (e) => {
  if (e.method !== "GET") {
    return;
  }
  if (e.handled === false || getResponseStatus(e) === 404) {
    setResponseStatus(e, 200);
    setResponseHeader(e, "Content-Type", "text/html");
    return sendStream(e, createReadStream(resolve(publicDir(), "index.html")));
  }
});

export default eventHandler({
  handler() {},
  onBeforeResponse: [beforeResponse],
});

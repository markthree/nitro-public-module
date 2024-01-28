import { lookup } from "mrmime";
import { fileURLToPath } from "node:url";
import { createReadStream, existsSync } from "fs";
import { basename, dirname, resolve } from "node:path";
import { withoutLeadingSlash, withoutTrailingSlash } from "ufo";

export function serverDir() {
  if (import.meta.dev) {
    return "./";
  }
  return dirname(fileURLToPath(import.meta.url));
}

export function publicDir() {
  if (import.meta.dev) {
    return "./public";
  }
  return resolve(serverDir(), "../public");
}

/**
 * create a fallback middleware for public
 * @param {(withoutSlashPathname: string) => { file?: string, mime?: string, withPublicDir?: boolean } | void} factory
 */
export function createPublicFallbackMiddleware(factory) {
  const beforeResponse = defineResponseMiddleware(async (e) => {
    if (e.method !== "GET") {
      return;
    }
    const noHandled = e.handled === false || getResponseStatus(e) === 404;

    if (!noHandled) {
      return;
    }

    const withoutSlashPathname = withoutLeadingSlash(
      withoutTrailingSlash(getRequestURL(e).pathname),
    );

    const result = await factory(withoutSlashPathname);

    if (!result) {
      return;
    }

    let { file, mime, withPublicDir = true } = result;

    if (typeof file !== "string") {
      return;
    }

    if (withPublicDir) {
      file = resolve(publicDir(), file);
    }

    if (existsSync(file)) {
      setResponseStatus(e, 200);
      setResponseHeader(e, "Content-Type", mime ?? lookup(basename(file)));
      return sendStream(e, createReadStream(file));
    }
  });

  return eventHandler({
    handler() {},
    onBeforeResponse: [beforeResponse],
  });
}

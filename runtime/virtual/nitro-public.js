import { lookup } from "mrmime";
import { fileURLToPath } from "node:url";
import { lstat } from "node:fs/promises";
import { basename, dirname, join } from "pathe";
import { createReadStream, existsSync } from "node:fs";
import { withoutLeadingSlash, withoutTrailingSlash } from "ufo";
import {
  defineResponseMiddleware,
  eventHandler,
  getRequestURL,
  getResponseStatus,
  sendStream,
  setResponseHeader,
  setResponseStatus,
} from "#imports";

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
  return join(serverDir(), "../public");
}

/**
 * create a fallback middleware for public
 * @typedef {{ file?: string, contentType?: string, withPublicDir?: boolean }} Meta
 * @param {(withoutSlashPathname: string) => Meta | Promise<Meta> | void} factory
 */
export function createPublicFallbackMiddleware(factory) {
  if (import.meta.dev) {
    return eventHandler(() => {});
  }
  const beforeResponse = defineResponseMiddleware(async (e) => {
    if (e.method !== "GET") {
      return;
    }

    const noHandled = e.handled === false || getResponseStatus(e) === 404;

    if (!noHandled) {
      return;
    }

    const withoutSlashPathname = withoutLeadingSlash(
      withoutTrailingSlash(decodeURIComponent(getRequestURL(e).pathname)),
    );

    const meta = await factory(withoutSlashPathname);

    if (!meta) {
      return;
    }

    let { file, contentType, withPublicDir = true } = meta;

    if (typeof file !== "string") {
      return;
    }

    if (withPublicDir) {
      file = join(publicDir(), file);
    }

    if (existsSync(file) && (await lstat(file)).isFile()) {
      setResponseStatus(e, 200);
      contentType ??= lookup(basename(file)) ?? "text/html";
      if (contentType.includes("text") || contentType.includes("application")) {
        contentType += "; charset=utf-8";
      }
      setResponseHeader(e, "Content-Type", contentType);
      return sendStream(e, createReadStream(file));
    }
  });

  return eventHandler({
    handler() {},
    onBeforeResponse: [beforeResponse],
  });
}

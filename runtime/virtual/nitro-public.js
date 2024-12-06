import { lookup } from "mrmime";
import { dirname, join } from "pathe";
import { fileURLToPath } from "node:url";
import { lstat } from "node:fs/promises";
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
 * @param { {skipDev?: boolean} } options
 */
export function createPublicFallbackMiddleware(
  factory,
  options = { skipDev: true },
) {
  if (options.skipDev && import.meta.dev) {
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
      if (!contentType) {
        contentType = getContentType(file);
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

/**
 * get contentType
 * @param {string | undefined} file
 * @example
 * ```js
 * import { getContentType } from "#nitro-public";
 *
 * getContentType("index.html") // text/html; charset=utf-8
 * ```
 */
export function getContentType(file) {
  if (!file) {
    return "text/html; charset=utf-8";
  }

  const contentType = lookup(file);
  if (!contentType) {
    return "text/html; charset=utf-8";
  }

  if (contentType.includes("charset")) {
    return contentType;
  }

  if (isUtf8Charset(contentType)) {
    return contentType + "; charset=utf-8";
  }

  return contentType;
}

const ignoreFlag = ["stream", "zip"];
const textFlag = ["text", "java", "xml", "json", "script"];

/**
 * @param {string} contentType
 * @returns {boolean}
 * @example
 * ```js
 * import { getContentType } from "#nitro-public";
 *
 * getContentType("index.html") // text/html; charset=utf-8
 * ```
 */
export function isUtf8Charset(contentType) {
  if (textFlag.some((v) => contentType.includes(v))) {
    return !ignoreFlag.some((v) => contentType.includes(v));
  }
  return false;
}

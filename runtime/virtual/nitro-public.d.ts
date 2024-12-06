import { eventHandler } from "#imports";

export const serverDir: () => string;

export const publicDir: () => string;

interface Meta {
  /**
   * file
   */
  file?: string;
  /**
   * Content-Type
   */
  contentType?: string;
  /**
   * @default true
   */
  withPublicDir?: boolean;
}

type Factory = (withoutSlashPathname: string) => Meta | Promise<Meta> | void;

/**
 * create a fallback middleware for public
 * @example
 * ```js
 * import { createPublicFallbackMiddleware } from "#nitro-public";
 *
 * export default createPublicFallbackMiddleware((withoutSlashPathname) => {
 * // some logic...
 * return {
 *    file: "index.html", // your file
 *    contentType: "text/html", // If not set, it will be inferred from the extname of the file
 *    withPublicDir: true, // Default to true, help you process the path
 *  };
 * });
 * ```
 */
export const createPublicFallbackMiddleware: (
  factory: Factory,
  options?: {
    /**
     * @default true
     */
    skipDev?: boolean;
  },
) => typeof eventHandler;

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
export const getContentType: (
  file?: string,
) => string;

/**
 * @param {string} contentType
 * @returns {boolean}
 * @example
 * ```js
 * import { isUtf8Charset } from "#nitro-public";
 *
 * isUtf8Charset("text/html") // true
 * ```
 */
export const isUtf8Charset: (
  contentType: string,
) => boolean;

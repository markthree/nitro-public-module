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

export const createPublicFallbackMiddleware: (
  factory: Factory,
) => typeof eventHandler;

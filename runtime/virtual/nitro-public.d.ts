import { eventHandler } from "#imports";

export const serverDir: () => string;

export const publicDir: () => string;

type Factory = (withoutSlashPathname: string) => {
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
} | void;

export const createPublicFallbackMiddleware: (
  factory: Factory,
) => typeof eventHandler;

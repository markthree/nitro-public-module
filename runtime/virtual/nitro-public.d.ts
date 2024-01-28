import { NitroEventHandler } from "nitropack";

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
  mime?: string;
  /**
   * @default true
   */
  withPublicDir?: boolean;
} | void;

export const createPublicFallbackMiddleware: (
  factory: Factory,
) => NitroEventHandler["handler"];

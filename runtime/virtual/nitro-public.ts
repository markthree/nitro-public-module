import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

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

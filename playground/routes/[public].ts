import { publicDir } from "#nitro-public";

export default defineEventHandler(() => publicDir());

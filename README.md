# nitro-public-module

nitro module for better public compatibility (for pure node runtime)

<br />

## Usage

### install

```shell
npm i nitro-public-module -D
```

### Configuration Module

> nuxt

```ts
// nuxt.config.ts
import nitroPublic from "nitro-public-module";

export default defineNuxtConfig({
  nitro: {
    modules: [nitroPublic()],
  },
});
```

> nitro

```ts
// nitro.config.js
import nitroPublic from "nitro-public-module";

export default defineNitroConfig({
  modules: [nitroPublic()],
});
```

<br />

### preset

```ts
// nitro.config.js
import nitroPublic from "nitro-public-module";

export default defineNitroConfig({
  modules: [
    nitroPublic({
      // support "spa", "ssg"，"fallback" and false (disable)，default to "fallback"
      preset: "fallback",
    }),
  ],
});
```

#### fallback

Support rollback of any file in production environment (even if dynamically
added to public)

#### spa

Allow you to run `spa` app in public

#### ssg

Allow you to run `ssg` app in public

<br />

#### custom

1. disable preset first

```ts
// nitro.config.js
import nitroPublic from "nitro-public-module";

export default defineNitroConfig({
  modules: [
    nitroPublic({
      preset: false,
    }),
  ],
});
```

2. create custom middleware

```ts
// middleware/public-fallback.ts
import { createPublicFallbackMiddleware } from "#nitro-public";

export default createPublicFallbackMiddleware((withoutSlashPathname) => {
  // some logic...

  return {
    file: "index.html", // your file
    contentType: "text/html", // If not set, it will be inferred from the extname of the file
    withPublicDir: true, // Default to true, help you process the path
  };
});
```

##### virtual

In addition to providing `createPublicFallbackMiddleware`, `#nitro-public` also
offers `publicDir` and `serverDir`

```ts
import {
  createPublicFallbackMiddleware,
  publicDir,
  serverDir,
} from "#nitro-public";
```

All functions are `type safe` and support `development` and `production`
environments (for pure node runtime)

<br />

## License

Made with [name](https://github.com/markthree)

Published under [MIT License](./LICENSE).

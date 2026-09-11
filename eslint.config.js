// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // Disabled: flags the `export const X = {...} as const; export type X = typeof X[...]`
    // pattern used throughout src/core/constants.ts and src/domain for string-union enums,
    // where a value and a type intentionally share a name (valid TS, distinct namespaces).
    rules: {
      "@typescript-eslint/no-redeclare": "off",
    },
  },
]);

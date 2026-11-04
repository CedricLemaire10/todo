import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.browser,
    },
  },

  {
    ...pluginReact.configs.flat.recommended,
    files: ["**/*.{js,jsx}"],
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/prop-types": "off"
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  {
    ...pluginReact.configs.flat["jsx-runtime"],
    files: ["**/*.{js,jsx}"],
  },
  {
    files: ["cypress/**/*.js", "cypress/**/*.jsx"],
    languageOptions: {
      globals: {
          ...globals.browser,
          ...globals.mocha,
          cy: "readonly",
          Cypress: "readonly",
      },
    },
  },
]);
module.exports = {
  root: true,

  env: {
    es6: true,
    node: true,
    browser: true,
    webextensions: true,
  },

  parser: "vue-eslint-parser",

  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2019,
    sourceType: "module",
    ecmaFeatures: {
      globalReturn: true,
    },
  },

  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
  ],

  rules: {
    semi: ["error", "always"],
    "max-len": [
      "warn",
      {
        code: 120,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    "no-empty": ["error", { allowEmptyCatch: true }],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-inferrable-types": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};

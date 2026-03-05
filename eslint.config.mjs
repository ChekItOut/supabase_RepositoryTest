import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  // Next.js 기본 설정
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Prettier 충돌 방지 (마지막에 배치)
  ...compat.extends("prettier"),

  // 공통 설정
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      // TypeScript 규칙
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],

      // Unused imports 자동 제거
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // React 19 규칙
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // 일반 규칙
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Server Components 전용 규칙
  {
    files: ["app/**/*.{ts,tsx}", "!app/**/*.client.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react-dom"],
              message:
                "Server Components에서는 react-dom을 사용할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },

  // 설정 파일 제외
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "public/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
    ],
  },
];

export default eslintConfig;

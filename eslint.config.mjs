// eslint.config.js (atau nama file flat config-mu)
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptParser from "@typescript-eslint/parser"; // Perlu parser TypeScript
import typescriptPlugin from "@typescript-eslint/eslint-plugin"; // Perlu plugin TypeScript

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"), // next/core-web-vitals sudah mencakup aturan TS untuk Next.js

  // Objek konfigurasi tambahan untuk aturan kustom
  {
    files: ["**/*.ts", "**/*.tsx"], // Targetkan file TypeScript dan TSX
    languageOptions: {
      parser: typescriptParser, // Tentukan parser TypeScript
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin, // Daftarkan plugin TypeScript
    },
    rules: {
      // Menonaktifkan aturan no-explicit-any
      "@typescript-eslint/no-explicit-any": "off",

      // Jika errornya adalah tentang 'require' (misalnya @typescript-eslint/no-var-requires atau no-require-imports)
      // dan kamu ingin mengizinkannya di file tertentu, gunakan 'overrides' seperti di bawah
      // atau jika ingin mengizinkannya secara global (tidak disarankan):
      // "@typescript-eslint/no-var-requires": "off",
      // "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;

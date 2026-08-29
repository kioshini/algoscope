import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "node_modules", "pyodide");
const destination = resolve(root, "public", "pyodide");
const files = ["pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"];

await mkdir(destination, { recursive: true });
await Promise.all(files.map((file) => copyFile(resolve(source, file), resolve(destination, file))));

console.log(`Synced ${files.length} Pyodide runtime files to public/pyodide.`);

import fs from "node:fs";
import { rollup } from "rollup";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import VueMacros from "unplugin-vue-macros/rollup";
import esbuild from "rollup-plugin-esbuild";
import glob from "fast-glob";
import type { OutputOptions } from "rollup";
import { resolvePackagePath } from "./utils";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const getExternal = async (pkgDirName: string) => {
  const pkgPath = resolvePackagePath(pkgDirName, "package.json");
  const manifest = fs.readFileSync(pkgPath).toJSON().data;
  const {
    dependencies = {},
    peerDependencies = {},
    devDependencies = {},
  } = manifest;
  const deps: string[] = [
    ...new Set([
      ...Object.keys(dependencies),
      ...Object.keys(peerDependencies),
      ...Object.keys(devDependencies),
    ]),
  ];
  return (id: string) => {
    if (id.endsWith(".css")) {
      return true;
    }
    return deps.some((pkg) => id === pkg || id.startsWith(`${pkg}/`));
  };
};

const build = async (pkgDirName: string) => {
  const pkgDistPath = resolvePackagePath(pkgDirName, "dist");

  if (fs.existsSync(pkgDistPath) && fs.statSync(pkgDistPath).isDirectory()) {
    fs.rmSync(pkgDistPath, { recursive: true });
  }

  const input = await glob(["**/*.{js,jsx,ts,tsx,vue}", "!node_modules"], {
    cwd: resolvePackagePath(pkgDirName, "src"),
    absolute: true,
    onlyFiles: true,
  });

  const bundle = await rollup({
    input,
    plugins: [
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue({
            isProduction: true,
          }),
          // vueJsx: vueJsx()
        },
      }),
      commonjs({
        extensions: [".js"],
        // Optional peer deps of ws. Native deps that are mostly for performance.
        // Since ws is not that perf critical for us, just ignore these deps.
        ignore: ["bufferutil", "utf-8-validate"],
      }),
      json(),
      nodeResolve({
        extensions: [".mjs", ".js", ".json", ".ts"],
      }),
      esbuild({
        sourceMap: true,
        target: "es2015",
        loaders: {
          ".vue": "ts",
        },
      }),
    ],
    external: await getExternal(pkgDirName),
    treeshake: false,
  });
  return bundle.write({
    format: "esm",
    dir: resolvePackagePath(pkgDirName, "dist", "esm"),
    exports: undefined,
    preserveModules: true,
    preserveModulesRoot: resolvePackagePath(pkgDirName, "src"),
    sourcemap: true,
    entryFileNames: "[name].mjs",
  });
};

(async () => {
  console.log("[TS] 开始编译所有子模块···");

  await build("components");
  console.log("[TS] 编译所有子模块成功！");
})();

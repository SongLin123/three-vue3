import { createServer } from "vite";
import { resolvePackagePath } from "./utils";
import pluginVue from "@vitejs/plugin-vue";
// import pluginVueJsx from '@vitejs/plugin-vue-jsx';

(async () => {
  const server = await createServer({
    // any valid user config options, plus `mode` and `configFile`
    configFile: false,
    root: resolvePackagePath("components"),
    publicDir: "../../public",
    plugins: [
      pluginVue(),
      //  pluginVueJsx()
    ],
    server: {
      port: 8080,
    },
  });
  await server.listen();

  server.printUrls();
})();

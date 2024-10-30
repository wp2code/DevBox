// electron.vite.config.ts
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { readdirSync, access } from "fs";
import {
  defineConfig,
  loadEnv,
  externalizeDepsPlugin,
  swcPlugin
} from "electron-vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ElementPlus from "unplugin-element-plus/vite";
import viteCompression from "vite-plugin-compression";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import UnoCSS from "unocss/vite";
var __electron_vite_injected_dirname = "D:\\wp2code\\github\\kaleido-client";
var pathSrc = resolve(__electron_vite_injected_dirname, "src/renderer/src");
var electron_vite_config_default = ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const optimizeDepsElementPlusIncludes = [
    "element-plus/es",
    "@vuemap/vue-amap/es",
    "vue-codemirror",
    "@codemirror/theme-one-dark",
    "@codemirror/lang-javascript"
  ];
  readdirSync("node_modules/element-plus/es/components").map((dirname) => {
    access(
      `node_modules/element-plus/es/components/${dirname}/style/css.mjs`,
      (err) => {
        if (!err) {
          optimizeDepsElementPlusIncludes.push(
            `element-plus/es/components/${dirname}/style/css`
          );
        }
      }
    );
  });
  const silenceSomeSassDeprecationWarnings = {
    verbose: true,
    logger: {
      warn(message, options) {
        const span = options.span ?? void 0;
        const stack = (options.stack === "null" ? void 0 : options.stack) ?? void 0;
        if (options.deprecation) {
          if (message.startsWith(
            "Using / for division outside of calc() is deprecated"
          )) {
            return;
          }
        }
        if (span !== void 0) {
        }
        if (stack !== void 0) {
        }
      }
    }
  };
  return defineConfig({
    main: {
      envPrefix: "M_VITE_",
      plugins: [externalizeDepsPlugin(), swcPlugin()],
      build: {
        reportCompressedSize: false,
        lib: {
          entry: ["src/main/index.ts"]
        }
      }
    },
    preload: {
      envPrefix: "PRE_VITE_",
      build: {
        reportCompressedSize: false,
        lib: {
          entry: ["src/preload/index.ts"]
        }
      },
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      base: "./",
      publicDir: "assets",
      envPrefix: "RD_VITE_",
      build: {
        reportCompressedSize: false
      },
      resolve: {
        alias: {
          "@": resolve(__electron_vite_injected_dirname, "src/renderer/src"),
          "~": resolve("src")
        }
      },
      css: {
        // CSS 预处理器
        preprocessorOptions: {
          //define global scss variable
          scss: {
            ...silenceSomeSassDeprecationWarnings,
            // javascriptEnabled: true,
            additionalData: `
              @use "@/styles/variables.scss" as *;
            `
          },
          sass: {
            ...silenceSomeSassDeprecationWarnings
          }
        }
      },
      server: {
        host: "0.0.0.0",
        port: Number(env.RD_VITE_PORT),
        open: false,
        proxy: {
          "/api": {
            target: `${env.RD_VITE_API_HOST}`,
            changeOrigin: true,
            rewrite: (path) => {
              return path.replace(/^\/api/, env.RD_VITE_API_PREFIX);
            }
          }
        }
      },
      plugins: [
        vue({
          script: {
            defineModel: true
          }
        }),
        vueJsx(),
        //解决message和notification引入不生效问题
        // createStyleImportPlugin({
        //   resolves: [ElementPlusResolve()],
        // }),
        ElementPlus({
          useSource: true
        }),
        AutoImport({
          // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
          imports: ["vue", "@vueuse/core"],
          resolvers: [
            // 自动导入 Element Plus 组件
            ElementPlusResolver(),
            // 自动导入图标组件
            IconsResolver({ prefix: "Icon" })
          ],
          vueTemplate: true,
          dts: false,
          // dts: "src/renderer/auto-imports.d.ts",
          eslintrc: {
            enabled: true,
            // Default `false`
            filepath: "./.eslintrc-auto-import.json",
            // Default `./.eslintrc-auto-import.json`
            globalsPropValue: true
            // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
          }
        }),
        Components({
          resolvers: [
            // 自动导入 Element Plus 组件
            ElementPlusResolver(),
            // 自动注册图标组件
            IconsResolver({
              enabledCollections: ["ep"]
            })
          ],
          // 指定自定义组件位置(默认:src/renderer/src/components)
          dirs: ["src/**/components", "src/components"],
          // 配置文件位置(false:关闭自动生成)
          dts: true
          // dts: "src/renderer/components.d.ts",
        }),
        Icons({
          autoInstall: true
        }),
        createSvgIconsPlugin({
          // 指定需要缓存的图标文件夹
          iconDirs: [resolve(pathSrc, "assets/icons")],
          // 指定symbolId格式
          symbolId: "icon-[name]"
        }),
        //https://github.com/antfu/unocss
        UnoCSS({}),
        // 代码压缩
        viteCompression({
          verbose: true,
          // 默认即可
          disable: true,
          // 是否禁用压缩，默认禁用，true为禁用,false为开启，打开压缩需配置nginx支持
          deleteOriginFile: true,
          // 删除源文件
          threshold: 10240,
          // 压缩前最小文件大小
          algorithm: "gzip",
          // 压缩算法
          ext: ".gz"
          // 文件类型
        })
      ],
      optimizeDeps: {
        include: [
          "vue",
          "vue-router",
          "pinia",
          "axios",
          "vue-i18n",
          "path-to-regexp",
          ...optimizeDepsElementPlusIncludes
        ]
      }
    }
  });
};
export {
  electron_vite_config_default as default
};
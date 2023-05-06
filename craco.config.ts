import path from "path";
import CracoLessPlugin from "craco-less";
// import { API_URL } from "./src/config";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: webpackConfig => {
      const scopePluginIndex =
        webpackConfig.resolve.plugins.findIndex(
          ({constructor}) =>
            constructor &&
            constructor.name === 'ModuleScopePlugin',
        );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return webpackConfig;
    },

    plugins: [
      //If the Transform of stream does not work, be sure to unload to the stream package
      // `yarn remove stream`
      //https://github.com/Richienb/node-polyfill-webpack-plugin
      new NodePolyfillPlugin({
        excludeAliases: ["console"],
      }),
      //for debug
      /* new TerserPlugin({
        parallel: true,
        extractComments: false, //remove comment step 1
        terserOptions: {
          sourceMap: false, // Must be set to true if using source-maps in production
          ecma: undefined,
          parse: {},
          format: {
            comments: false, //remove comment step 2
          },
          compress: {
            warnings: false,
            drop_console: process.env.NODE_ENV !== "development", // remove all contents of the console from the production environment
            drop_debugger: process.env.NODE_ENV !== "development", // Remove breakpoints
          },
        },
      }),*/
    ],
    devServer: {
      open: false,
      // proxy: {
      //   "/api/":
      //   {
      //     target: "http://dev_domain.com",
      //     changeOrigin: true,
      //     pathRewrite: { "^/api": "" },
      //   }
      // },
    },
  },

  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {},
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};

const webpack = require("webpack");

module.exports = {
  publicPath: "/travel-expenses",
  transpileDependencies: ["vuex-module-decorators"],
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      })
    ]
  }
};

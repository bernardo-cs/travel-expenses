const webpack = require("webpack");

module.exports = {
  publicPath: "/travel-expenses",
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      })
    ]
  }
};

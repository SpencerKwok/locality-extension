module.exports = {
  webpack: function (config) {
    config.output.filename = config.output.filename.replace(
      "[name]",
      `${process.env.BUILD_NAME}.[name]`
    );
    config.output.chunkFilename = config.output.chunkFilename.replace(
      "[name]",
      `${process.env.BUILD_NAME}.[name]`
    );

    config.plugins.map((plugin, i) => {
      if (
        plugin.options &&
        plugin.options.filename &&
        plugin.options.filename.includes("static/css")
      ) {
        config.plugins[i].options = {
          ...config.plugins[i].options,
          filename: config.plugins[i].options.filename.replace(
            "[name]",
            `${process.env.BUILD_NAME}.[name]`
          ),
          chunkFilename: config.plugins[i].options.chunkFilename.replace(
            "[name]",
            `${process.env.BUILD_NAME}.[name]`
          ),
        };
      }
    });

    return config;
  },
  paths: function (paths) {
    paths.appHtml = paths.appHtml.replace(
      "index.html",
      `${process.env.BUILD_NAME}\\index.html`
    );
    paths.appIndexJs = paths.appIndexJs.replace(
      "index.js",
      `${process.env.BUILD_NAME}.tsx`
    );
    console.log(paths);
    return paths;
  },
};

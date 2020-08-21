const path = require("path");
const outputDir = "./dist";

module.exports = {
  entry: path.resolve(__dirname, "src", "index.js"), //
  output: {
    path: path.join(__dirname, outputDir),
    filename: "[name].js",
    publicPath: "/dist/",
  },
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-optional-chaining"],
            exclude: /node_modules/,
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              name: "[name].[ext]",
              outputPath: "src/assets/",
              publicPath: "src/assets/",
            },
          },
        ],
      }
    ],
  },
  plugins: [
    require("autoprefixer"),
  ],
};

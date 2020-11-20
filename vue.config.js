module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "./src/assets/bulma.scss";'
      }
    }
  },
  pages: {
    index: {
      entry: "src/main.ts",
      title: "INDEX"
    }
  }
};

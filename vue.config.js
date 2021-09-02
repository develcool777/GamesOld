module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/sass/style.scss";'
      }
    }
  },
  configureWebpack:{
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      }
    }
  }
}

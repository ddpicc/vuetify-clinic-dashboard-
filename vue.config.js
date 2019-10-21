module.exports = {
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
        '/api': {
            target: 'http://localhost:3000/api',
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''
            }
        }
    }
  }
}

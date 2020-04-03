module.exports = api => {
  api.extendPackage({
    devDependencies: {
      'eslint-config-vuetify': '*'
    },
    eslintConfig: {
      extends: 'vuetify'
    }
  })
}

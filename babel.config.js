/**
 *
 * @param api
 */
module.exports = function (api) {
  api.cache(true)
  const plugins = []

  return {
    plugins,

    presets: ['babel-preset-expo'],
  }
}

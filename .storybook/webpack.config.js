const path = require('path')

module.exports = ({ config }) => {
  /*
  config.module.rules.push({
    test: /\.(ts|tsx)$/,

    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
      },
    ],
  })
  */

  config.module.rules = config.module.rules.filter(
    (it) => !it || !it.test || !it.test.toString().startsWith('/\\.css$/')
  )

  config.module.rules = config.module.rules.map((it) => {
    let ret = it

    if (it.test && it.test.toString().includes('svg|')) {
      ret = { ...it }
      ret.test = new RegExp(it.test.toString().replace('svg|', ''))
    }

    return ret
  })

  config.module.rules.push({
    test: /\.css$/,
    use: ['raw-loader']
  })

  config.module.rules.push({
    test: /\.svg$/,
    use: {
      loader: 'svg-url-loader',
      options: {
        encoding: 'base64'
      }
    }
  })

  const alias = (config.resolve && config.resolve.alias) || {}

  alias['js-cockpit$'] = path.resolve(__dirname, '../src/main/js-widgets.ts')
  config.resolve.alias = alias
  config.resolve.extensions.push('.ts', '.tsx')

  return config
}

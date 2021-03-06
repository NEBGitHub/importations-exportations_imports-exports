import Tr from '../../app/TranslationTable'

const Express = require('express')
const Path = require('path')
const MustacheExpress = require('mustache-express')

const ApplicationRoot = require('../../ApplicationRoot.js')

const DevelopmentPageMiddleware = () => {
  const app = Express()

  // view engine setup
  app.engine('mustache', MustacheExpress())

  app.set('views', Path.join(ApplicationRoot, 'servers', 'views'))
  app.set('view engine', 'mustache')

  const router = Express.Router()

  router.get('/', (req, res) => {
    res.render('app', { title: 'WET 4.0.20' })
  })

  // NB: Don't try to use regexes to glob all of the visualization paths
  // The w+ regex doesn't properly grab some characters used in French
  Tr.getIn(['visualizationPaths']).forEach((paths) => {
    router.get('/*', (req, res) => {
      res.render('app', { title: 'WET 4.0.20' })
    })
  })

  app.use(router)

  // Turn off caching!
  app.disable('view cache')

  return app
}

module.exports = DevelopmentPageMiddleware

import Constants from '../Constants'
import Tr from '../TranslationTable'

/*
The following members of the app's state are routable: they are represented in
the URL bar. When the app loads, its state is initialized from the URL bar, and
as the user navigates around the URL bar is kept up to date with the current
state.

These items are represented as URL parameters:
  columns
  categories
  showEmptyCategories
  pinnedIncidents

Language is also represented, but is inferred from the application path.
  en: /pipeline-incidents
  fr: /incidents-pipeliniers
See applicationPath in TranslationTable.js

In each case, the meaning of an element's absence from the URL is specified, and
the element is not added to the URL bar if the current state matches the
meaning associated with absence.

*/

const RouteComputations = {


  bitlyParameter(location, language) {
    return `${Constants.get('appHost')}${Tr.getIn(['applicationPath', language])}${encodeURIComponent(location.search)}`
  },

  bitlyEndpoint(location, language) {
    switch (process.env.NODE_ENV) {
      case 'development': {
        const root = RouteComputations.appRoot(location, language)
        return `${root}bitly_url`
      }
      case 'production':
        return `${location.origin}/bitlyService/api/bitlyShortlink`
    }
  },

  dataEndpoint: () => {
    if (process.env.NODE_ENV === 'development') {
      // FIXME: Hardcoded language because the data isn't language specific
      const root = RouteComputations.appRoot(document.location, 'en')
      return `${root}data/data.json`
    }
    return `${location.origin}/import-export-visualization/data/data.json`
  },

  // A string for the root of the application, a suitable place for making rest
  // requests or building other URLs. E.g.:
  // http://localhost:3001/pipeline-incidents/
  // https://apps2.neb-one.gc.ca/incidents-pipeliniers/
  appRoot(location, language) {
    return `${location.origin}${Tr.getIn(['applicationPath', language])}`
  },

  screenshotMode(location) {
    return !!location.pathname.match(`/${Constants.get('screenshotPath')}$`)
  },

  // Based on the current URL, construct a URL to the screenshottable version
  // of the visualization, and also encode it for use as a URL parameter itself.
  // The server will make the request of localhost, we only need to construct
  // the remainder of the path
  // NB: Location.pathname includes the leading slash in the url, e.g.:
  // In 'foo.com/bar', pathname is '/bar'
  screenshotParameter(location) {
    return encodeURIComponent(`${location.pathname}screenshot${location.search}`)
  },

  screenshotOrigin(location) {
    switch (process.env.NODE_ENV) {
      case 'development':
        return 'http://localhost:3004'
      case 'production':
        return location.origin
    }
  },


}


module.exports = RouteComputations

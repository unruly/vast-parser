import vastParser from './vastParser'
import vastErrorCodes from './vastErrorCodes'
import VastError from './vastError'
import VastResponse from './model/vastResponse'
import helpers from './util/helpers'
import { makeJqueryAjaxRequest as _makeJqueryAjaxRequest } from './util/makeJqueryAjaxRequest'
import jQuery from 'jquery'

const AJAX_TIMEOUT = 10000

function getDomainFromURL (url) {
  return new URL(helpers.ensureProtocol(url)).hostname
}

function domainAllowsCorsCookies (vastConfig, url) {
  if (!(vastConfig.corsCookieDomainBlacklist instanceof Array)) {
    return true
  }
  return vastConfig.corsCookieDomainBlacklist.indexOf(getDomainFromURL(url)) === -1
}

function appendParamsToUrl (url, params) {
  if (params && params.length > 0) {
    if (url.indexOf('?') !== -1) {
      url += '&' + params
    } else {
      url += '?' + params
    }
  }
  return url
}

function evaluateVASTXMLDocument (vastBody, vastResponse, dispatcher, requestEndEvent, parseVast) {
  let vastTag = parseVast(vastBody)

  if (vastTag.VAST.Error && !vastTag.VAST.Ad) {
    dispatcher.trigger(requestEndEvent)
    throw new VastError(vastErrorCodes.NO_ADS.code, vastResponse, 'VAST request returned no ads and contains error tag')
  }

  if (!vastTag.VAST.Ad) {
    dispatcher.trigger(requestEndEvent)
    throw new VastError(vastErrorCodes.NO_ADS.code, vastResponse, 'VAST request returned no ads')
  }

  if (vastTag.VAST && vastTag.VAST.Ad && vastTag.VAST.Ad.InLine) {
    vastResponse.inline = vastTag
    dispatcher.trigger(requestEndEvent)
    return {
      inline: vastResponse
    }
  } else {
    vastResponse.wrappers.push(vastTag)
    dispatcher.trigger(requestEndEvent)

    return {
      nextUrl: vastTag.VAST && vastTag.VAST.Ad && vastTag.VAST.Ad.Wrapper && vastTag.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue
    }
  }
}

export default function (
  {
    PromiseModule = Promise,
    $ = jQuery,
    parseVast = vastParser.parse,
    Response = VastResponse,
    makeJqueryAjaxRequest = _makeJqueryAjaxRequest
  } = {}) {
  let vastRequestCounter = 0

  let dispatcher = $({})

  function addEventListener (eventName, handler) {
    dispatcher.on(eventName, handler)
  }

  function makeVastRequest (
    vastResponse,
    vastConfig,
    sendCookies,
    resolve,
    reject,
    httpMethod = 'GET'
  ) {
    let url = appendParamsToUrl(vastConfig.url, vastConfig.extraParams)

    let settings = {
      url: url,
      headers: vastConfig.headers || {},
      dataType: 'xml',
      method: httpMethod
    }

    if (sendCookies && domainAllowsCorsCookies(vastConfig, url)) {
      settings.xhrFields = {
        withCredentials: true
      }
    }

    if (httpMethod === 'POST') {
      settings.data = vastConfig.data || ''
      settings.contentType = vastConfig.contentType || 'application/xml'
    }

    settings.timeout = AJAX_TIMEOUT

    settings.success = function (data, status, jqXHR) {
      let requestEndEvent

      requestEndEvent = $.Event('requestEnd', {
        requestNumber: vastRequestCounter,
        uri: url,
        vastResponse: vastResponse
      })

      vastResponse.addRawResponse({
        requestNumber: vastRequestCounter,
        uri: url,
        response: jqXHR.responseText,
        headers: jqXHR.getAllResponseHeaders().trim()
      })

      if (!data) {
        dispatcher.trigger(requestEndEvent)
        reject(new VastError(vastErrorCodes.XML_PARSE_ERROR.code, vastResponse))
        return
      }

      parseVastBody(data, vastResponse, vastConfig, requestEndEvent, resolve, reject)
    }

    settings.error = function (jqXHR, textStatus, errorThrown) {
      let code,
        requestEndEvent,
        statusText

      if (jqXHR.status === 0 && textStatus !== 'timeout' && sendCookies) {
        makeVastRequest(vastResponse, vastConfig, false, resolve, reject)
        return
      }

      if (jqXHR.status === 200 && !jqXHR.responseXML) {
        code = vastErrorCodes.XML_PARSE_ERROR.code
        statusText = vastErrorCodes.XML_PARSE_ERROR.message
      } else {
        code = vastErrorCodes.WRAPPER_URI_TIMEOUT.code
        statusText = jqXHR.statusText
      }

      requestEndEvent = $.Event('requestEnd', {
        requestNumber: vastRequestCounter,
        uri: url,
        vastResponse: vastResponse,
        error: {
          status: jqXHR.status,
          statusText: statusText
        }
      })

      vastResponse.addRawResponse({
        requestNumber: vastRequestCounter,
        uri: url,
        response: jqXHR.responseText,
        headers: jqXHR.getAllResponseHeaders().trim()
      })

      dispatcher.trigger(requestEndEvent)
      reject(new VastError(code, vastResponse, 'VAST Request Failed (' + textStatus + ' ' + jqXHR.status + ') with message [' + errorThrown + '] for ' + url))
    }

    dispatcher.trigger(
      $.Event('requestStart', {
        requestNumber: vastRequestCounter,
        uri: url,
        vastResponse: vastResponse
      })
    )

    makeJqueryAjaxRequest(settings, $)
  }

  function parseVastBody (vastBody, vastResponse, vastConfig, requestEndEvent, resolve, reject) {
    try {
      let { inline, nextUrl } = evaluateVASTXMLDocument(vastBody, vastResponse, dispatcher, requestEndEvent, parseVast)

      if (inline) {
        resolve(inline)
      } else if (nextUrl) {
        let nextRequestConfig = {
          url: helpers.convertProtocol(nextUrl),
          extraParams: vastConfig.extraParams,
          corsCookieDomainBlacklist: vastConfig.corsCookieDomainBlacklist
        }

        vastRequestCounter++
        makeVastRequest(vastResponse, nextRequestConfig, true, resolve, reject)
      } else {
        throw new VastError(vastErrorCodes.WRAPPER_URI_TIMEOUT.code, vastResponse)
      }
    } catch (ex) {
      reject(ex)
    }
  }

  function getVastChain (vastConfig) {
    let vastResponse = new Response()
    const httpMethod = vastConfig.httpMethod || 'GET'
    return new PromiseModule(function (resolve, reject) {
      if (vastConfig.url) {
        makeVastRequest(vastResponse, vastConfig, true, resolve, reject, httpMethod)
      } else if (vastConfig.vastBody && vastConfig.vastBodyUrl) {
        const requestEndEvent = $.Event('requestEnd', {
          requestNumber: vastRequestCounter,
          vastResponse: vastResponse,
          uri: vastConfig.vastBodyUrl
        })

        vastResponse.addRawResponse({
          requestNumber: vastRequestCounter,
          uri: vastConfig.vastBodyUrl
        })

        parseVastBody(vastConfig.vastBody, vastResponse, vastConfig, requestEndEvent, resolve, reject)
      } else {
        reject(new VastError(vastErrorCodes.UNDEFINED_ERROR.code, vastResponse, 'Vast-Parser configuration error, missing required attribute "url" or "vast (Both Body and BodyUrl)"'))
      }
    })
  }

  return {
    getVastChain: getVastChain,
    addEventListener: addEventListener,
    on: addEventListener
  }
}

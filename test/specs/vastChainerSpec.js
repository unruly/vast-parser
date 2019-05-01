import vastChainer from '../../src/vastChainer'
import vastErrorCodes from '../../src/vastErrorCodes'
import VastError from '../../src/vastError'
import VastResponse from '../../src/model/vastResponse'
import helpers from '../../src/util/helpers'

describe('VAST Chainer', function () {
  var jQuery

  var mockServer

  var mockWrapper

  var mockTwoWrapperWrapper

  var mockNoAds

  var mockAds

  var mockInline

  var mockError

  var mockDeferred

  var mockPromise

  var mockDispatcher

  var targetingUUID = 'ABCDEF-1234'

  var mockTwoWrapperString = '<TWO_WRAPPER_TEST></TWO_WRAPPER_TEST>'

  var mockWrapperString = '<WRAPPER></WRAPPER>'

  var mockInlineString = '<INLINE></INLINE>'

  var mockNoAdsString = '<NOADS></NOADS>'

  var vastErrorString = '<ERROR></ERROR>'

  var mockAdsString = '<ERROR></ERROR><WRAPPER></WRAPPER>'

  var firstWrapperUrl = 'http://example.com/targeting/' + targetingUUID + '?params=values'

  var now = 100

  var wrapperConfig

  var mockClock

  var mockDeps

  beforeEach(function () {
    mockPromise = {}
    mockPromise.then = sinon.stub().returns(mockPromise)
    mockPromise.catch = sinon.stub().returns(mockPromise)

    mockDeferred = {
      reject: sinon.stub(),
      resolve: sinon.stub()
    }

    let PromiseModule = function (callback) {
      callback(mockDeferred.resolve, mockDeferred.reject)
      return mockPromise
    }

    mockDispatcher = {
      trigger: sinon.spy(),
      on: sinon.spy()
    }

    let $ = function () {
      return mockDispatcher
    }
    $.support = {
      cors: true
    }
    $.Event = sinon.spy((event, data) => (
      {
        event,
        data
      }
    ))
    $.ajax = sinon.spy()

    let parseVast = sinon.spy(function (document) {
      switch (document) {
        case mockNoAdsString:
          return mockNoAds
        case mockAdsString:
          return mockAds
        case mockInlineString:
          return mockInline
        case mockTwoWrapperString:
          return mockTwoWrapperWrapper
        case vastErrorString:
          return mockError
      }
      return mockWrapper
    })

    mockDeps = {
      PromiseModule,
      $,
      parseVast
    }

    jQuery = mockDeps.$

    mockWrapper = {
      'VAST': {
        'Ad': {
          'Wrapper': {
            'VASTAdTagURI': {
              'nodeValue': 'http://inlineVASTUrlDomain.com/'
            }
          }
        }
      }
    }

    mockTwoWrapperWrapper = {
      'VAST': {
        'Ad': {
          'Wrapper': {
            'VASTAdTagURI': {
              'nodeValue': firstWrapperUrl
            }
          }
        }
      }
    }

    mockInline = {
      VAST: {
        Ad: {
          InLine: {

          }
        }
      }
    }

    mockError = {
      VAST: {
        Error: {}
      }
    }

    mockNoAds = {
      VAST: {}
    }

    mockAds = {
      VAST: {}
    }

    wrapperConfig = {
      url: firstWrapperUrl
    }

    mockServer = sinon.fakeServer.create()
    mockClock = sinon.useFakeTimers(now)
  })

  afterEach(function () {
    mockServer.restore()
    mockClock.restore()
  })

  function vastError (error, message) {
    return sinon.match(function (value) {
      return value instanceof VastError &&
                value.code === error.code &&
                value.message.indexOf(message || error.message) >= 0
    }, 'instance of VastError, matching code property and a substring of the message property')
  }

  function hasVastResponseProperty () {
    return sinon.match(function (value) {
      return value.vastResponse instanceof VastResponse
    }, 'instance of VastResponse')
  }

  describe('getVastChain', function () {
    it('should make a GET request by default', () => {
      vastChainer(mockDeps).getVastChain(wrapperConfig)

      const settings = jQuery.ajax.firstCall.args[0]
      expect(settings.method).to.equal('GET')
    })

    it('rejects promise when VAST tag request times out in 10 seconds', function () {
      vastChainer(mockDeps).getVastChain({ url: 'http://non.existent.endpoint' })

      expect(
        jQuery.ajax
      ).to.have.been.calledOnce

      const settings = jQuery.ajax.firstCall.args[0]

      expect(
        settings.timeout
      ).to.equal(
        10000
      )

      expect(mockDeferred.reject).to.not.have.been.called

      settings.error({ status: 0, getAllResponseHeaders () { return '' } }, 'timeout', new Error())

      expect(
        mockDeferred.reject
      ).to.have.been.calledWithMatch(
        vastError(vastErrorCodes.WRAPPER_URI_TIMEOUT, 'VAST Request Failed (timeout 0)')
      )

      expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty())
    })

    it('rejects promise when VAST tag request fails', function () {
      vastChainer(mockDeps).getVastChain({ url: 'http://non.existent.endpoint' })

      expect(
        jQuery.ajax
      ).to.have.been.calledOnce

      const settings = jQuery.ajax.firstCall.args[0]
      settings.error({ status: 404, getAllResponseHeaders () { return '' } }, 'error', new Error())

      expect(mockDeferred.reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.WRAPPER_URI_TIMEOUT, 'VAST Request Failed (error 404)'))
      expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty())
    })

    it('rejects promise when VAST tag is not valid XML', function () {
      vastChainer(mockDeps).getVastChain(wrapperConfig)

      expect(
        jQuery.ajax
      ).to.have.been.calledOnce

      const settings = jQuery.ajax.firstCall.args[0]
      settings.error({ status: 200, getAllResponseHeaders () { return '' }, responseXML: undefined }, 'parsererror', new Error())

      expect(mockDeferred.reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.XML_PARSE_ERROR, 'VAST Request Failed (parsererror 200)'))
      expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty())
    })

    it('rejects promise includes VAST Request URL and HTTP errorThrown message on error message', function () {
      vastChainer(mockDeps).getVastChain(wrapperConfig)

      expect(
        jQuery.ajax
      ).to.have.been.calledOnce

      const settings = jQuery.ajax.firstCall.args[0]
      settings.error({ status: 200, getAllResponseHeaders () { return '' }, responseXML: undefined }, 'parsererror', new Error('Invalid XML: This is not XML'))

      expect(mockDeferred.reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.XML_PARSE_ERROR, 'VAST Request Failed (parsererror 200) with message [Error: Invalid XML: This is not XML] for ' + firstWrapperUrl))
      expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty())
    })

    it('rejects promise when response is empty', function () {
      vastChainer(mockDeps).getVastChain(wrapperConfig)

      expect(
        jQuery.ajax
      ).to.have.been.calledOnce

      const settings = jQuery.ajax.firstCall.args[0]
      settings.success(undefined, undefined, { status: 200, getAllResponseHeaders () { return '' } })

      expect(mockDeferred.reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.XML_PARSE_ERROR))
      expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty())
    })

    it('rejects promise when VAST tag is empty', function () {
      vastChainer(mockDeps).getVastChain(wrapperConfig)

      expect(
        jQuery.ajax
      ).to.have.been.calledOnce

      const settings = jQuery.ajax.firstCall.args[0]
      settings.success(mockNoAdsString, undefined, { status: 200, getAllResponseHeaders () { return '' } })

      expect(mockDeferred.reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.NO_ADS, 'VAST request returned no ads'))
      expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty())
    })

    it('rejects promise when VAST response has Error tag and No Ad', function () {
      let mockPromise = {}
      mockPromise.then = sinon.stub().returns(mockPromise)
      mockPromise.catch = sinon.stub().returns(mockPromise)

      let mockDeferreds = []

      let PromiseModule = function (callback) {
        let mockDeferred = {
          reject: sinon.stub(),
          resolve: sinon.stub()
        }
        mockDeferreds.push(mockDeferred)
        callback(mockDeferred.resolve, mockDeferred.reject)
        return mockPromise
      }

      mockNoAds.VAST.Error = true
      mockNoAds.VAST.Ad = false

      vastChainer(Object.assign({}, mockDeps, {PromiseModule})).getVastChain(wrapperConfig)

      const settings = jQuery.ajax.firstCall.args[0]
      settings.success(mockNoAdsString, undefined, { status: 200, getAllResponseHeaders () { return '' } })

      expect(mockDeferreds[0].reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.NO_ADS, 'VAST request returned no ads and contains error tag'))
      expect(mockDeferreds[0].reject).to.have.been.calledWithMatch(hasVastResponseProperty())
    })

    it('parses response when VAST response has Error tag and an Ad', function () {
      mockAds.VAST.Error = true
      mockAds.VAST.Ad = {}
      mockAds.VAST.Ad.Wrapper = {}
      mockAds.VAST.Ad.Wrapper.VASTAdTagURI = {}
      mockAds.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue = 'true'

      vastChainer(mockDeps).getVastChain(wrapperConfig)

      const settings = jQuery.ajax.firstCall.args[0]
      settings.success(mockAdsString, undefined, { status: 200, getAllResponseHeaders () { return '' } })

      expect(mockDeps.parseVast).to.have.been.called
      expect(mockDeferred.reject).to.not.have.been.called
    })

    it('parses response when VAST tag request is successful', function () {
      vastChainer(mockDeps).getVastChain(wrapperConfig)

      const settings = jQuery.ajax.firstCall.args[0]
      settings.success(mockInlineString, undefined, { status: 200, getAllResponseHeaders () { return '' } })

      expect(mockDeps.parseVast).to.have.been.called
      expect(mockDeferred.reject).to.not.have.been.called
    })

    it('requests inline VAST if parsed VAST tag is a wrapper', function () {
      vastChainer(mockDeps).getVastChain(wrapperConfig)

      const settings = jQuery.ajax.firstCall.args[0]
      settings.success(mockWrapperString, undefined, { status: 200, getAllResponseHeaders () { return '' } })

      expect(jQuery.ajax.calledTwice).to.equal(true)

      var inlineRequest = jQuery.ajax.secondCall
      expect(inlineRequest.args[0].url).to.equal('//inlineVASTUrlDomain.com/')
    })

    it('should set headers from vastConfig on first ajax call', function () {
      wrapperConfig.headers = {
        'X-A-Header': 'a value'
      }

      vastChainer(mockDeps).getVastChain(wrapperConfig)
      const settings = jQuery.ajax.firstCall.args[0]
      settings.success(mockWrapperString, undefined, { status: 200, getAllResponseHeaders () { return '' } })

      expect(jQuery.ajax.calledTwice).to.be.true
      expect(jQuery.ajax.firstCall.args[0].headers).to.deep.equal(wrapperConfig.headers)
      expect(jQuery.ajax.secondCall.args[0].headers).to.deep.equal({})
    })

    it('rejects promise when inline VAST request from parsed VAST wrapper fails', function () {
      const successfulWrapperCall = firstWrapperUrl
      const failedInlineCall = helpers.convertProtocol(mockWrapper.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue)

      jQuery.ajax = (settings) => {
        switch (settings.url) {
          case successfulWrapperCall:
            settings.success(mockWrapperString, {}, { status: 200, getAllResponseHeaders () { return '' } })
            break
          case failedInlineCall:
            settings.error({ status: 404, getAllResponseHeaders () { return '' } }, 'error')
            break
          default:
            throw new Error('shouldn\'t happen')
        }
      }

      vastChainer(mockDeps).getVastChain(wrapperConfig)

      expect(
        mockDeferred.reject
      ).to.have.been.calledWithMatch(
        vastError(vastErrorCodes.WRAPPER_URI_TIMEOUT, 'VAST Request Failed (error 404)')
      )

      expect(
        mockDeferred.reject
      ).to.have.been.calledWithMatch(
        hasVastResponseProperty()
      )
    })

    it('send cookies on first request, which fails, then retry without cookies', function () {
      wrapperConfig.url = 'http://targeting.acooladcompany.com/i/am/a/cool/targeting/server?abc=123'

      jQuery.ajax = sinon.spy((settings) => {
        // Fake out a CORS issue with status 0 for now :~(
        settings.error({ status: 0, getAllResponseHeaders () { return '' } }, 'error')
      })

      vastChainer(mockDeps).getVastChain(wrapperConfig)

      expect(jQuery.ajax.calledTwice).to.equal(true)

      var wrapperRequest = jQuery.ajax.firstCall.args[0]
      expect(wrapperRequest.url).to.equal(wrapperConfig.url)
      expect(wrapperRequest.xhrFields.withCredentials).to.be.true

      var inlineRequest = jQuery.ajax.secondCall.args[0]
      expect(inlineRequest.url).to.equal(wrapperConfig.url)
      expect(inlineRequest.xhrFields).to.equal(undefined)
    })

    it('do not send cookies on first request if domain in blacklist', function () {
      wrapperConfig.url = 'http://targeting.acooladcompany.com/i/am/a/cool/targeting/server?abc=123'

      wrapperConfig.corsCookieDomainBlacklist = ['targeting.acooladcompany.com']

      jQuery.ajax = sinon.spy((settings) => {
        if (settings.url === wrapperConfig.url) {
          settings.success(mockWrapperString, undefined, { status: 200, getAllResponseHeaders () { return '' } })
        }
      })

      vastChainer(mockDeps).getVastChain(wrapperConfig)

      expect(jQuery.ajax.calledTwice).to.equal(true)

      var wrapperRequest = jQuery.ajax.firstCall.args[0]
      expect(wrapperRequest.url).to.equal(wrapperConfig.url)
      expect(wrapperRequest.xhrFields).to.equal(undefined)
    })

    it('do not send cookies on first and second request if domain in blacklist', function () {
      wrapperConfig.url = 'http://targeting.acooladcompany.com/i/am/a/cool/targeting/server?abc=123'

      wrapperConfig.corsCookieDomainBlacklist = ['targeting.acooladcompany.com', 'inlinevasturldomain.com']

      jQuery.ajax = sinon.spy((settings) => {
        if (settings.url === wrapperConfig.url) {
          settings.success(mockWrapperString, undefined, { status: 200, getAllResponseHeaders () { return '' } })
        }
      })

      vastChainer(mockDeps).getVastChain(wrapperConfig)

      expect(jQuery.ajax.calledTwice).to.equal(true)

      var wrapperRequest = jQuery.ajax.firstCall.args[0]
      expect(wrapperRequest.url).to.equal(wrapperConfig.url)
      expect(wrapperRequest.xhrFields).to.equal(undefined)

      var inlineRequest = jQuery.ajax.secondCall.args[0]
      expect(inlineRequest.url).to.equal('//inlineVASTUrlDomain.com/')
      expect(inlineRequest.xhrFields).to.equal(undefined)
    })

    it('fulfills promise with array of VAST tags', function () {
      jQuery.ajax = (settings) => {
        switch (settings.url) {
          case firstWrapperUrl:
            settings.success(mockWrapperString, {}, { status: 200, getAllResponseHeaders () { return '' } })
            break
          case helpers.convertProtocol(mockWrapper.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue):
            settings.success(mockInlineString, {}, { status: 200, getAllResponseHeaders () { return '' } })
            break
          default:
            throw new Error('shouldn\'t happen')
        }
      }

      vastChainer(mockDeps)
        .getVastChain(wrapperConfig)

      var finalTags = mockDeferred.resolve.firstCall.args[0]

      expect(mockDeferred.resolve).to.have.been.calledOnce
      expect(finalTags).to.be.an.instanceof(VastResponse)
      expect(finalTags.inline).to.equal(mockInline)
      expect(finalTags.wrappers[0]).to.equal(mockWrapper)
    })

    it('extracts 2 wrappers and an inline', function () {
      var twoWrapperRequestUrl = 'http://example.com/three_chain_vast.xml'

      wrapperConfig.url = twoWrapperRequestUrl

      jQuery.ajax = (settings) => {
        switch (helpers.convertProtocol(settings.url)) {
          case helpers.convertProtocol(firstWrapperUrl):
            settings.success(mockWrapperString, {}, { status: 200, getAllResponseHeaders () { return '' } })
            break
          case helpers.convertProtocol(twoWrapperRequestUrl):
            settings.success(mockTwoWrapperString, {}, { status: 200, getAllResponseHeaders () { return '' } })
            break
          case helpers.convertProtocol(mockWrapper.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue):
            settings.success(mockInlineString, {}, { status: 200, getAllResponseHeaders () { return '' } })
            break
          default:
            throw new Error('shouldn\'t happen')
        }
      }

      vastChainer(mockDeps).getVastChain(wrapperConfig)

      var finalTags = mockDeferred.resolve.firstCall.args[0]

      expect(finalTags).to.be.an.instanceof(VastResponse)
      expect(finalTags.inline).to.equal(mockInline)
      expect(finalTags.wrappers[0]).to.equal(mockTwoWrapperWrapper)
      expect(finalTags.wrappers[1]).to.equal(mockWrapper)
    })

    describe('with extra params', function () {
      beforeEach(function () {
        wrapperConfig.extraParams = 'unruly_cb=' + now
      })

      it('should use question mark if the url does not have a query string', function () {
        var urlWithNoQueryParams = 'http://example.com/' + targetingUUID
        wrapperConfig.url = urlWithNoQueryParams

        vastChainer(mockDeps).getVastChain(wrapperConfig)

        expect(
          jQuery.ajax.firstCall.args[0].url
        ).to.equal(
          urlWithNoQueryParams + '?' + wrapperConfig.extraParams
        )
      })

      it('requests inline VAST if parsed VAST tag is a wrapper - without query string', function () {
        jQuery.ajax = sinon.spy((settings) => {
          if (settings.url.indexOf(wrapperConfig.url) === 0) {
            settings.success(mockWrapperString, undefined, { status: 200, getAllResponseHeaders () { return '' } })
          }
        })

        vastChainer(mockDeps).getVastChain(wrapperConfig)

        expect(
          jQuery.ajax.calledTwice
        ).to.equal(true)

        var inlineRequest = jQuery.ajax.secondCall
        expect(
          inlineRequest.args[0].url
        ).to.equal(
          helpers.convertProtocol('http://inlineVASTUrlDomain.com/' + '?' + wrapperConfig.extraParams)
        )
      })

      it('requests inline VAST if parsed VAST tag is a wrapper - with existing query string', function () {
        var expectedUrl = 'http://inlineVASTUrlDomain.com/?hey=there%20buddy'
        mockWrapper.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue = expectedUrl
        jQuery.ajax = sinon.spy((settings) => {
          if (settings.url.indexOf(wrapperConfig.url) === 0) {
            settings.success(mockWrapperString, undefined, { status: 200, getAllResponseHeaders () { return '' } })
          }
        })

        vastChainer(mockDeps).getVastChain(wrapperConfig)

        expect(
          jQuery.ajax.calledTwice
        ).to.equal(true)

        var inlineRequest = jQuery.ajax.secondCall
        expect(
          inlineRequest.args[0].url
        ).to.equal(
          helpers.convertProtocol(expectedUrl + '&' + wrapperConfig.extraParams)
        )
      })
    })

    describe('with a POST request', () => {
      beforeEach(function () {
        wrapperConfig.httpMethod = 'POST'
        wrapperConfig.data = '<VAST><Ad>This is a Test VAST</Ad></VAST>'
        wrapperConfig.contentType = 'text/xml'
      })

      it('makes an initial POST request if specified by the vastConfig', () => {
        vastChainer(mockDeps).getVastChain(wrapperConfig)

        const settings = jQuery.ajax.firstCall.args[0]
        expect(settings.method).to.equal('POST')
      })

      it('passes through the correct data to be included in POST request', () => {
        vastChainer(mockDeps).getVastChain(wrapperConfig)

        const settings = jQuery.ajax.firstCall.args[0]
        expect(settings.data).to.equal(wrapperConfig.data)
        expect(settings.contentType).to.equal(wrapperConfig.contentType)
      })

      it('passes through application/xml to be included in POST request, if no contentType specified', () => {
        wrapperConfig = { httpMethod: 'POST', url: 'http://inlineVASTUrlDomain.com/' }
        vastChainer(mockDeps).getVastChain(wrapperConfig)

        const settings = jQuery.ajax.firstCall.args[0]
        expect(settings.contentType).to.equal('application/xml')
      })

      it('passes an empty string to be included in POST request, if no data specified', () => {
        wrapperConfig = { httpMethod: 'POST', url: 'http://inlineVASTUrlDomain.com/' }
        vastChainer(mockDeps).getVastChain(wrapperConfig)

        const settings = jQuery.ajax.firstCall.args[0]
        expect(settings.data).to.equal('')
      })

      it('allows us to make a CORS request', () => {
        vastChainer(mockDeps).getVastChain(wrapperConfig)

        const settings = jQuery.ajax.firstCall.args[0]
        expect(settings.xhrFields.withCredentials).to.be.true
      })

      it('ensures a subsequent request is GET', () => {
        jQuery.ajax = sinon.spy((settings) => {
          if (settings.url === wrapperConfig.url) {
            settings.success(mockWrapperString, undefined, { status: 200, getAllResponseHeaders () { return '' } })
          }
        })

        vastChainer(mockDeps).getVastChain(wrapperConfig)

        expect(jQuery.ajax.calledTwice).to.equal(true)

        const inlineRequest = jQuery.ajax.secondCall.args[0]
        expect(inlineRequest.method).to.equal('GET')
      })
    })
  })

  describe('fire download events', function () {
    it('subscribes to jQuery event handlers on the dispatcher', function () {
      const beginVastDownload = function () {}
      const finishVastDownload = function () {}

      const vastChainerInstance = vastChainer(mockDeps)

      expect(
        mockDispatcher.on
      ).to.not.have.been.called

      vastChainerInstance.addEventListener('requestStart', beginVastDownload)
      expect(
        mockDispatcher.on
      ).to.have.been.calledWith('requestStart', beginVastDownload)

      vastChainerInstance.addEventListener('requestEnd', finishVastDownload)
      expect(
        mockDispatcher.on
      ).to.have.been.calledWith('requestEnd', finishVastDownload)
    })

    it('should fire request start and stop on download of inline VAST', function () {
      const vastChainerInstance = vastChainer(mockDeps)

      const jQueryEvents = {
        Start: {},
        End: {}
      }
      jQuery.Event = sinon.stub()
      jQuery.Event.withArgs(
        'requestEnd'
      ).returns(jQueryEvents.Start)

      jQuery.Event.withArgs(
        'requestStart'
      ).returns(jQueryEvents.End)

      vastChainerInstance.getVastChain(wrapperConfig)

      expect(
        mockDispatcher.trigger
      ).to.have.been.calledWith(
        jQueryEvents.Start
      )
      expect(
        jQuery.Event
      ).to.have.been.calledWithMatch(
        'requestStart',
        {
          requestNumber: 0,
          uri: firstWrapperUrl
        }
      )

      const settings = jQuery.ajax.firstCall.args[0]
      settings.success(null, undefined, { status: 200, getAllResponseHeaders () { return '' } })

      expect(
        mockDispatcher.trigger
      ).to.have.been.calledWith(
        jQueryEvents.End
      )
      expect(
        jQuery.Event
      ).to.have.been.calledWithMatch(
        'requestEnd',
        {
          requestNumber: 0,
          uri: firstWrapperUrl
        }
      )
    })

    it('should fire requestEnd with vastBodyUrl for vast body requests', function () {
      const vastChainerInstance = vastChainer(mockDeps)

      const vastConfig = {
        vastBody: '<vast />',
        vastBodyUrl: 'https://example.com/openrtb'
      }

      const jQueryEvents = {
        End: {}
      }
      jQuery.Event = sinon.stub()
      jQuery.Event.withArgs(
        'requestEnd'
      ).returns(jQueryEvents.End)

      vastChainerInstance.getVastChain(vastConfig)

      expect(jQuery.Event).to.have.been.calledWithMatch(
        'requestEnd',
        {
          requestNumber: 0,
          uri: 'https://example.com/openrtb'
        }
      )
    })

    it('should only fire request start stop once when retrying without cookies', function () {
      const vastChainerInstance = vastChainer(mockDeps)

      let isFirstCall = true
      jQuery.ajax = sinon.spy((settings) => {
        if (isFirstCall) {
          settings.error({ status: 0, getAllResponseHeaders () { return '' } }, 'error')
          isFirstCall = false
        } else {
          settings.success(null, undefined, { status: 200, getAllResponseHeaders () { return '' } })
        }
      })

      const jQueryEvents = {
        Start: {},
        End: {}
      }
      jQuery.Event = sinon.stub()
      jQuery.Event.withArgs(
        'requestEnd'
      ).returns(jQueryEvents.Start)

      jQuery.Event.withArgs(
        'requestStart'
      ).returns(jQueryEvents.End)

      vastChainerInstance.getVastChain(wrapperConfig)

      expect(
        mockDispatcher.trigger
      ).to.have.been.calledWith(
        jQueryEvents.Start
      )
      expect(
        jQuery.Event
      ).to.have.been.calledWithMatch(
        'requestStart',
        {
          requestNumber: 0,
          uri: firstWrapperUrl
        }
      )

      expect(
        mockDispatcher.trigger
      ).to.have.been.calledWith(
        jQueryEvents.End
      )
      expect(
        jQuery.Event
      ).to.have.been.calledWithMatch(
        'requestEnd',
        {
          requestNumber: 0,
          uri: firstWrapperUrl
        }
      )

      // TODO: Make test pass with this uncommented
      // expect(
      //     mockDispatcher.trigger
      // ).to.have.been.calledTwice;
    })

    it('should fire request start and stop on download of VAST Wrapper and Inline', function () {
      const vastChainerInstance = vastChainer(mockDeps)

      const wrapperUrl = helpers.convertProtocol(firstWrapperUrl)
      const inlineUrl = helpers.convertProtocol(mockWrapper.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue)

      jQuery.ajax = sinon.spy((settings) => {
        switch (helpers.convertProtocol(settings.url)) {
          case wrapperUrl:

            expect(
              mockDispatcher.trigger
            ).to.have.been.calledWithMatch(
              {
                event: 'requestStart',
                data: {
                  requestNumber: 0,
                  uri: firstWrapperUrl
                }
              }
            )

            settings.success(mockWrapperString, {}, { status: 200, getAllResponseHeaders () { return '' } })

            expect(
              mockDispatcher.trigger
            ).to.have.been.calledWithMatch(
              {
                event: 'requestEnd',
                data: {
                  requestNumber: 0,
                  uri: firstWrapperUrl
                }
              }
            )
            break
          case inlineUrl:

            expect(
              mockDispatcher.trigger
            ).to.have.been.calledWithMatch(
              {
                event: 'requestStart',
                data: {
                  requestNumber: 1,
                  uri: inlineUrl
                }
              }
            )

            settings.success(mockInlineString, {}, { status: 200, getAllResponseHeaders () { return '' } })

            expect(
              mockDispatcher.trigger
            ).to.have.been.calledWithMatch(
              {
                event: 'requestEnd',
                data: {
                  requestNumber: 1,
                  uri: inlineUrl
                }
              }
            )
            break
          default:
            throw new Error('shouldn\'t happen')
        }
      })

      vastChainerInstance.getVastChain(wrapperConfig)

      expect(
        mockDispatcher.trigger.callCount
      ).to.equal(
        4
      )
    })

    it('should fire request start and stop on download of VAST with Error', function () {
      const vastChainerInstance = vastChainer(mockDeps)

      jQuery.ajax = sinon.spy((settings) => {
        expect(
          mockDispatcher.trigger
        ).to.have.been.calledWithMatch(
          {
            event: 'requestStart',
            data: {
              requestNumber: 0,
              uri: firstWrapperUrl
            }
          }
        )

        settings.success(vastErrorString, {}, { status: 200, getAllResponseHeaders () { return '' } })

        expect(
          mockDispatcher.trigger
        ).to.have.been.calledWithMatch(
          {
            event: 'requestEnd',
            data: {
              requestNumber: 0,
              uri: firstWrapperUrl
            }
          }
        )
      })

      vastChainerInstance.getVastChain(wrapperConfig)
    })

    it('should fire request start and stop on download of VAST without Ad', function () {
      const vastChainerInstance = vastChainer(mockDeps)

      jQuery.ajax = sinon.spy((settings) => {
        expect(
          mockDispatcher.trigger
        ).to.have.been.calledWithMatch(
          {
            event: 'requestStart',
            data: {
              requestNumber: 0,
              uri: firstWrapperUrl
            }
          }
        )

        settings.success(mockNoAdsString, {}, { status: 200, getAllResponseHeaders () { return '' } })

        expect(
          mockDispatcher.trigger
        ).to.have.been.calledWithMatch(
          {
            event: 'requestEnd',
            data: {
              requestNumber: 0,
              uri: firstWrapperUrl
            }
          }
        )
      })

      vastChainerInstance.getVastChain(wrapperConfig)
    })

    it('should fire request start and stop when requested data is falsey', function () {
      const vastChainerInstance = vastChainer(mockDeps)

      jQuery.ajax = sinon.spy((settings) => {
        expect(
          mockDispatcher.trigger
        ).to.have.been.calledWithMatch(
          {
            event: 'requestStart',
            data: {
              requestNumber: 0,
              uri: firstWrapperUrl
            }
          }
        )

        settings.success('', {}, { status: 200, getAllResponseHeaders () { return '' } })

        expect(
          mockDispatcher.trigger
        ).to.have.been.calledWithMatch(
          {
            event: 'requestEnd',
            data: {
              requestNumber: 0,
              uri: firstWrapperUrl
            }
          }
        )
      })

      vastChainerInstance.getVastChain(wrapperConfig)
    })

    it('should fire request end when the request fails', function () {
      const vastChainerInstance = vastChainer(mockDeps)

      jQuery.ajax = sinon.spy((settings) => {
        expect(
          mockDispatcher.trigger
        ).to.have.been.calledWithMatch(
          {
            event: 'requestStart',
            data: {
              requestNumber: 0,
              uri: firstWrapperUrl
            }
          }
        )

        settings.error({ status: 404, getAllResponseHeaders () { return '' }, statusText: 'Not Found' }, '', new Error())

        expect(
          mockDispatcher.trigger
        ).to.have.been.calledWithMatch(
          {
            event: 'requestEnd',
            data: {
              requestNumber: 0,
              uri: firstWrapperUrl,
              error: {
                status: 404,
                statusText: 'Not Found'
              }
            }
          }
        )
      })

      vastChainerInstance.getVastChain(wrapperConfig)
    })

    it('should still fire requestEnd when VAST tag is not valid XML', function () {
      const vastChainerInstance = vastChainer(mockDeps)

      jQuery.ajax = sinon.spy((settings) => {
        settings.error({ status: 200, responseXML: null, getAllResponseHeaders () { return '' }, statusText: 'XML parsing error.' }, '', new Error())

        expect(
          mockDispatcher.trigger
        ).to.have.been.calledWithMatch(
          {
            event: 'requestEnd',
            data: {
              requestNumber: 0,
              uri: firstWrapperUrl,
              error: {
                status: 200,
                statusText: 'XML parsing error.'
              }
            }
          }
        )
      })

      vastChainerInstance.getVastChain(wrapperConfig)
    })
  })

  describe('stores raw data on vast response', function () {
    it('should call addRawResponse after successful http request', function () {
      const mockResponse = {
        addRawResponse: sinon.spy()
      }

      function VastResponse () {
        return mockResponse
      }

      jQuery.ajax = sinon.spy((settings) => {
        settings.success(
          mockInlineString,
          {},
          {
            status: 200,
            responseText: mockInlineString,
            getAllResponseHeaders () { return 'Content-Type: application/json' }
          }
        )
      })

      vastChainer(Object.assign({ Response: VastResponse }, mockDeps)).getVastChain(wrapperConfig)

      expect(mockResponse.addRawResponse).to.have.been.calledOnce
      expect(mockResponse.addRawResponse).to.have.been.calledWith({
        requestNumber: 0,
        uri: firstWrapperUrl,
        response: mockInlineString,
        headers: 'Content-Type: application/json'
      })
    })

    it('should call addRawResponse after unsuccessful http request', function () {
      const mockResponse = {
        addRawResponse: sinon.spy()
      }

      function VastResponse () {
        return mockResponse
      }

      jQuery.ajax = sinon.spy((settings) => {
        settings.error({ status: 500, responseXML: null, responseText: '', getAllResponseHeaders () { return 'Content-Type: application/json' }, statusText: '' }, '', new Error())
      })

      vastChainer(Object.assign({ Response: VastResponse }, mockDeps)).getVastChain(wrapperConfig)

      expect(mockResponse.addRawResponse).to.have.been.calledOnce
      expect(mockResponse.addRawResponse).to.have.been.calledWith({
        requestNumber: 0,
        uri: firstWrapperUrl,
        response: '',
        headers: 'Content-Type: application/json'
      })
    })

    it('should call addRawResponse once per http response', function () {
      var inlineUrl = mockWrapper.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue

      const mockResponse = {
        addRawResponse: sinon.spy(),
        wrappers: []
      }

      function VastResponse () {
        return mockResponse
      }

      jQuery.ajax = sinon.spy((settings) => {
        switch (helpers.convertProtocol(settings.url)) {
          case helpers.convertProtocol(firstWrapperUrl):
            settings.success(mockWrapperString, {}, { status: 200, getAllResponseHeaders () { return 'Content-Type: application/json' }, responseText: mockWrapperString })
            break
          case helpers.convertProtocol(inlineUrl):
            settings.success('', {}, { status: 400, getAllResponseHeaders () { return 'Content-Type: application/json' }, responseText: '' })
            break
          default:
            throw new Error('shouldn\'t happen')
        }
      })

      vastChainer(Object.assign({ Response: VastResponse }, mockDeps)).getVastChain(wrapperConfig)

      expect(mockResponse.addRawResponse).to.have.been.calledWithMatch({
        requestNumber: 0,
        uri: firstWrapperUrl,
        response: mockWrapperString,
        headers: 'Content-Type: application/json'
      })

      expect(mockResponse.addRawResponse).to.have.been.calledWithMatch({
        requestNumber: 1,
        uri: helpers.convertProtocol(inlineUrl),
        response: '',
        headers: 'Content-Type: application/json'
      })

      expect(mockResponse.addRawResponse).to.have.been.calledTwice
    })

    it('rejects promise when neither a url nor vastBody/Url are provided', function () {
      vastChainer(mockDeps).getVastChain({})

      expect(
        jQuery.ajax
      ).not.to.have.been.called

      expect(
        mockDeferred.reject
      ).to.have.been.calledWithMatch(
        vastError(vastErrorCodes.UNDEFINED_ERROR, 'Vast-Parser configuration error, missing required attribute "url" or "vast (Both Body and BodyUrl)"')
      )
    })
  })
})

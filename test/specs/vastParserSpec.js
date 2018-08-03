import vastParser from '../../src/vastParser'
import fs from 'fs'
import { DOMParser } from 'xmldom'

describe('VAST Parser', function () {
  var targetingUUID = 'with-non-linear-ad-only'

  function loadTestXML (filename, test) {
    fs.readFile('test/resources/vast/' + filename, 'utf8', function (err, xmlString) {
      if (err) {
        throw err
      }

      var parser = new DOMParser()

      var xmlDocument = parser.parseFromString(xmlString, 'text/xml')

      test(xmlDocument)
    })
  }

  describe('parses VAST Inline', function () {
    var inlineURL = 'inlines/test_vast_inline_123.xml'

    it('parses AdTitle from XML document', function (done) {
      loadTestXML(inlineURL, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.InLine.AdTitle.nodeValue).to.equal('Example Title')

        done()
      })
    })

    it('parses Description from XML document', function (done) {
      loadTestXML(inlineURL, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.InLine.Description.nodeValue).to.equal('Example Description')

        done()
      })
    })

    it('parses StaticResource (thumbnail) from XML document', function (done) {
      loadTestXML(inlineURL, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.InLine.Creatives.Creative[0].NonLinearAds.NonLinear.StaticResource.nodeValue).to.equal('http://example.com/thumb.jpg')

        done()
      })
    })

    it('parses NonLinearClickThrough from XML document', function (done) {
      loadTestXML(inlineURL, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.InLine.Creatives.Creative[0].NonLinearAds.NonLinear.NonLinearClickThrough.nodeValue).to.equal('http://example.com/clickthrough.html')

        done()
      })
    })

    it('linear object should not be defined', function (done) {
      loadTestXML(inlineURL, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.InLine.Creatives.Creative[0].Linear).to.be.undefined

        done()
      })
    })

    it('parses clickthrough url from linear creative', function (done) {
      var inlineWithClickThroughUrl = 'inlines/test_vast_inline_with-linear-and-non-linear-ads.xml'
      loadTestXML(inlineWithClickThroughUrl, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickThrough.nodeValue).to.equal('http://example.com/linear-video-clickthrough')

        done()
      })
    })

    it('parses click tracking pixel from VAST inline', function (done) {
      var inlineWithClickThroughUrl = 'inlines/test_vast_inline_with-linear-and-non-linear-ads.xml'

      loadTestXML(inlineWithClickThroughUrl, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickTracking.length).to.equal(2)

        expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickTracking[0]['@id']).to.equal('video_click')
        expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickTracking[0].nodeValue).to.equal('http://example.com/inline/linear-video-click')

        expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickTracking[1]['@id']).to.equal('post_video_click')
        expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickTracking[1].nodeValue).to.equal('http://example.com/inline/linear-post-video-click')

        done()
      })
    })

    it('parses AdParameters from linear creative', function (done) {
      var inlineWithAdParameters = 'inlines/test_vast_inline_with-linear-ad.xml'

      loadTestXML(inlineWithAdParameters, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.AdParameters['@xmlEncoded']).to.equal('true')
        expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.AdParameters.nodeValue).to.equal('{"testString":"an ad parameter string","testBoolean":false,"testNumber":1345680,"testURL":"http://example.com","testURLWithParams":"http%3A%2F%2Fexample.com%3Fparam1%3Dtrue%26param2%3Dfalse","testArray":["element1","element2"],"testArrayWithObjects":[{"key":"value"},{"key":"value"}]}')
        done()
      })
    })

    it('creative should always return an array, even when there is only one creative', function (done) {
      loadTestXML(inlineURL, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.InLine.Creatives.Creative.length).to.equal(1)

        done()
      })
    })

    it('extension should be an array even if there is only one extensions', function (done) {
      var inlineOneExtensionURL = 'inlines/test_vast_inline_with-long-video.xml'

      loadTestXML(inlineOneExtensionURL, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.InLine.Extensions.Extension).to.be.a('array')

        done()
      })
    })

    it('extension should be an array if there are more than one extensions', function (done) {
      var inlineWithMultipleExtensionsURL = 'inlines/test_vast_inline_with-multiple-extensions.xml'

      loadTestXML(inlineWithMultipleExtensionsURL, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.InLine.Extensions.Extension).to.be.a('array')

        done()
      })
    })

    describe('with Multiple Creatives', function () {
      var inlineURL = 'inlines/test_vast_inline_with-linear-ad.xml'

      it('parses MediaFile from XML Document and places in an array', function (done) {
        loadTestXML(inlineURL, function (vastDocument) {
          var obj = vastParser.parse(vastDocument)
          var expectedUrl = 'http://example.com/video.mp4'

          expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.MediaFiles.MediaFile).to.be.a('array')
          expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.MediaFiles.MediaFile[0].nodeValue).to.equal(expectedUrl)

          done()
        })
      })
    })

    describe('with Multiple Ads', function () {
      var inlineURL = 'inlines/test_vast_inline_with-multiple-ads.xml'

      it('stores one Ad and does not throw an exception', function (done) {
        loadTestXML(inlineURL, function (vastDocument) {
          var obj = vastParser.parse(vastDocument)

          expect(obj.VAST.Ad.InLine).to.not.be.undefined

          done()
        })
      })
    })
  })

  describe('parses VAST Wrapper', function () {
    var wrapperURL = 'wrappers/vast_wrapper_' + targetingUUID + '.xml'

    it('should extract extension object', function (done) {
      var vastWrapperWithExtensionWithPropertyXml = 'wrappers/vast_wrapper_with-extensions-with-property.xml'

      loadTestXML(vastWrapperWithExtensionWithPropertyXml, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        var extensionProperty = obj.VAST.Ad.Wrapper.Extensions.Extension[0].Property
        expect(extensionProperty).to.exist
        expect(extensionProperty['@id']).to.equal('skid')
        expect(extensionProperty.nodeValue).to.equal('123')

        done()
      })
    })

    it('impressions are empty array when none exist', function (done) {
      var adWithNoImpression = 'wrappers/vast_wrapper_with-linear-no-impression.xml'

      loadTestXML(adWithNoImpression, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.Impression).to.exist
        expect(obj.VAST.Ad.Wrapper.Impression).to.be.a('array')
        expect(obj.VAST.Ad.Wrapper.Impression.length).to.equal(0)

        done()
      })
    })

    it('impressions are array when only one', function (done) {
      var wrapperWithOneImpressionPixelUrl = 'wrappers/vast_wrapper_with-quartile-tracking.xml'

      loadTestXML(wrapperWithOneImpressionPixelUrl, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.Impression).to.be.a('array')
        expect(obj.VAST.Ad.Wrapper.Impression.length).to.equal(1)
        expect(obj.VAST.Ad.Wrapper.Impression[0].nodeValue).to.equal('http://example.com/imp?d=[CACHEBUSTER]')

        done()
      })
    })

    it('parses Impressions from XML document', function (done) {
      loadTestXML(wrapperURL, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.Impression[0].nodeValue).to.equal('http://example.com/imp?d=[CACHEBUSTER]')
        expect(obj.VAST.Ad.Wrapper.Impression[1].nodeValue).to.equal('http://example.com/another-imp?d=[CACHEBUSTER]')

        done()
      })
    })

    it('parses VASTAdTagURI from XML document', function (done) {
      loadTestXML(wrapperURL, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue).to.equal('http://localhost/test/resources/vast/inlines/test_vast_inline_123.xml')

        done()
      })
    })

    it('parses Error from XML document', function (done) {
      loadTestXML(wrapperURL, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.Error.nodeValue).to.equal('http://example.com/error/ERRORCODE')

        done()
      })
    })

    it('parses NonLinearClickTracking from XML document', function (done) {
      loadTestXML(wrapperURL, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.Creatives.Creative[0].NonLinearAds.NonLinear.NonLinearClickTracking[0].nodeValue).to.equal('http://example.com/click')

        done()
      })
    })

    it('parses start tracking pixel from VAST Wrapper containing linear and non-linear ads', function (done) {
      var wrapperWithLinearAndNonLinearTracking = 'wrappers/vast_wrapper_with-linear-and-non-linear-ads.xml'

      loadTestXML(wrapperWithLinearAndNonLinearTracking, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.TrackingEvents.Tracking[0]['@event']).to.equal('start')
        expect(obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.TrackingEvents.Tracking[0].nodeValue).to.equal('http://example.com/start?d=[CACHEBUSTER]')

        expect(obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.TrackingEvents.Tracking[1]['@event']).to.equal('start')
        expect(obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.TrackingEvents.Tracking[1].nodeValue).to.equal('http://example.com/start2?d=[CACHEBUSTER]')

        done()
      })
    })

    it('parses start tracking pixel from VAST Wrapper containing a linear ad only', function (done) {
      var wrapperWithLinearTracking = 'wrappers/vast_wrapper_with-linear-ad-only.xml'

      loadTestXML(wrapperWithLinearTracking, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.Creatives.Creative[0].Linear.TrackingEvents.Tracking['@event']).to.equal('start')
        expect(obj.VAST.Ad.Wrapper.Creatives.Creative[0].Linear.TrackingEvents.Tracking.nodeValue).to.equal('http://example.com/start')

        done()
      })
    })

    it('parses click tracking pixel from VAST Wrapper containing linear ads with no ids', function (done) {
      var wrapperWithClickTrackersWithNoIds = 'wrappers/vast_wrapper_with-click-track-with-no-ids.xml'

      loadTestXML(wrapperWithClickTrackersWithNoIds, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        var clickTracking = obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.VideoClicks.ClickTracking

        expect(clickTracking.length).to.equal(2)
        expect(clickTracking[0].nodeValue).to.equal('http://example.com/linear-click')
        expect(clickTracking[1].nodeValue).to.equal('http://example.com/linear-click2')

        done()
      })
    })

    it('parses click tracking pixel from VAST Wrapper containing linear and non-linear ads', function (done) {
      var wrapperWithLinearAndNonLinearTracking = 'wrappers/vast_wrapper_with-linear-and-non-linear-ads.xml'

      loadTestXML(wrapperWithLinearAndNonLinearTracking, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        var clickTracking = obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.VideoClicks.ClickTracking

        expect(clickTracking.length).to.equal(5)

        expect(clickTracking[0]['@id']).to.equal('video_click')
        expect(clickTracking[0].nodeValue).to.equal('http://example.com/linear-video-click')

        expect(clickTracking[1]['@id']).to.equal('video_click')
        expect(clickTracking[1].nodeValue).to.equal('http://example.com/linear-video-click2')

        expect(clickTracking[2]['@id']).to.equal('video_click')
        expect(clickTracking[2].nodeValue).to.equal('http://example.com/linear-video-click3')

        expect(clickTracking[3]['@id']).to.equal('post_video_click')
        expect(clickTracking[3].nodeValue).to.equal('http://example.com/linear-post-video-click')

        expect(clickTracking[4]['@id']).to.equal('post_video_click')
        expect(clickTracking[4].nodeValue).to.equal('http://example.com/linear-post-video-click2')

        done()
      })
    })

    it('parses click tracking pixel from VAST Wrapper containing a linear ad only', function (done) {
      var wrapperWithLinearTracking = 'wrappers/vast_wrapper_with-linear-ad-only.xml'

      loadTestXML(wrapperWithLinearTracking, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        var clickTracking = obj.VAST.Ad.Wrapper.Creatives.Creative[0].Linear.VideoClicks.ClickTracking

        expect(clickTracking.length).to.equal(2)

        expect(clickTracking[0]['@id']).to.equal('video_click')
        expect(clickTracking[0].nodeValue).to.equal('http://example.com/linear-video-click')

        expect(clickTracking[1]['@id']).to.equal('post_video_click')
        expect(clickTracking[1].nodeValue).to.equal('http://example.com/linear-post-video-click')

        done()
      })
    })

    it('doesnt break when no click tracking provided', function (done) {
      var wrapperWithLinearTracking = 'wrappers/vast_wrapper_with-no-clicks.xml'

      loadTestXML(wrapperWithLinearTracking, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.VideoClicks).to.be.undefined

        done()
      })
    })

    it('doesnt break when no creatives element provided', function (done) {
      var wrapperWithNoCreatives = 'wrappers/vast_wrapper_with-no-creatives.xml'

      loadTestXML(wrapperWithNoCreatives, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.Creatives).to.be.undefined

        done()
      })
    })

    it('doesnt break when VAST without nonlinear provided', function (done) {
      var wrapperWithNoCreatives = 'wrappers/vast_wrapper_no-nonlinear.xml'

      loadTestXML(wrapperWithNoCreatives, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.Creatives).to.not.be.undefined

        done()
      })
    })

    it('parses custom array from VAST Wrapper containing custom extensions', function (done) {
      var wrapperWithCustomElement = 'wrappers/vast_wrapper_with-custom-element.xml'

      loadTestXML(wrapperWithCustomElement, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.Extensions.Extension[0].CustomArray.CustomElement.length).to.equal(2)
        expect(obj.VAST.Ad.Wrapper.Extensions.Extension[0].CustomArray.CustomElement[0].nodeValue).to.equal('customData')
        expect(obj.VAST.Ad.Wrapper.Extensions.Extension[0].CustomArray.CustomElement[0]['@customId']).to.equal('stuff')

        expect(obj.VAST.Ad.Wrapper.Extensions.Extension[0].CustomArray.CustomElement[1].nodeValue).to.equal('moreCustomData')
        expect(obj.VAST.Ad.Wrapper.Extensions.Extension[0].CustomArray.CustomElement[1]['@customId']).to.equal('things')

        done()
      })
    })

    it('parses custom element from VAST Wrapper containing custom extensions', function (done) {
      var wrapperWithCustomElement = 'wrappers/vast_wrapper_with-custom-element.xml'

      loadTestXML(wrapperWithCustomElement, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.Extensions.Extension[0].CustomElement.nodeValue).to.equal('customThing')

        done()
      })
    })

    it('creative should always return an array, even when there is only one creative', function (done) {
      loadTestXML(wrapperURL, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad.Wrapper.Creatives.Creative.length).to.equal(1)

        done()
      })
    })

    describe('with Multiple Ads', function () {
      var wrapperURL = 'wrappers/vast_wrapper_with-multiple-ads.xml'

      it('stores one Ad and does not throw an exception', function (done) {
        loadTestXML(wrapperURL, function (vastDocument) {
          var obj = vastParser.parse(vastDocument)

          expect(obj.VAST.Ad.Wrapper).to.not.be.undefined

          done()
        })
      })
    })
  })

  describe('parses VAST with errors', function () {
    it('parses empty VAST tag', function (done) {
      var errorUrl = 'wrappers/vast_wrapper_no-ads.xml'
      loadTestXML(errorUrl, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST).not.to.be.undefined
        expect(obj.VAST.Ad).to.be.undefined

        done()
      })
    })

    it('parses error tag', function (done) {
      var errorUrl = 'wrappers/vast_wrapper_no-ads-and-error-tag.xml'
      loadTestXML(errorUrl, function (vastDocument) {
        var obj = vastParser.parse(vastDocument)

        expect(obj.VAST.Ad).to.be.undefined
        expect(obj.VAST.Error).to.be.defined

        done()
      })
    })
  })
})

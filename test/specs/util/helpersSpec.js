import helpers from '../../../src/util/helpers'

describe('Helpers Util', function () {
  describe('time converter', function () {
    it('should convert 00:00:00 time into seconds', function () {
      expect(helpers.getSecondsFromTimeString('00:00:00')).to.equal(0)
    })

    it('should convert 00:00:10 time into seconds', function () {
      expect(helpers.getSecondsFromTimeString('00:00:10')).to.equal(10)
    })

    it('should convert 00:03:10 time into seconds', function () {
      expect(helpers.getSecondsFromTimeString('00:03:10')).to.equal(190)
    })

    it('should convert 01:00:10 time into seconds', function () {
      expect(helpers.getSecondsFromTimeString('01:00:10')).to.equal(3610)
    })

    it('should convert 01:00:10.3 time into seconds', function () {
      expect(helpers.getSecondsFromTimeString('01:00:10.3')).to.equal(3610.3)
    })

    it('should convert 01:00:10.123 time into seconds', function () {
      expect(helpers.getSecondsFromTimeString('01:00:10.123')).to.equal(3610.123)
    })

    it('should return undefined if time is invalid(empty string)', function () {
      expect(helpers.getSecondsFromTimeString('')).to.be.undefined
    })

    it('should return undefined if time is invalid(not valid vast format)', function () {
      expect(helpers.getSecondsFromTimeString('12:23')).to.be.undefined
    })

    it('should return undefined if time undefined', function () {
      expect(helpers.getSecondsFromTimeString(undefined)).to.be.undefined
    })
  })

  describe('decodeXML', function () {
    it('should decode &apos; to \'', function () {
      expect(helpers.decodeXML('&apos;')).to.equal('\'')
    })

    it('should decode &quot; to "', function () {
      expect(helpers.decodeXML('&quot;')).to.equal('"')
    })

    it('should decode &gt; to >', function () {
      expect(helpers.decodeXML('&gt;')).to.equal('>')
    })

    it('should decode &lt; to <', function () {
      expect(helpers.decodeXML('&lt;')).to.equal('<')
    })

    it('should decode &amp; to &', function () {
      expect(helpers.decodeXML('&amp;')).to.equal('&')
    })
  })

  describe('convertProtocol', function () {
    it('should return url with https when url is https', function () {
      var httpsUrl = 'https://example.com'

      expect(helpers.convertProtocol(httpsUrl)).to.equal(httpsUrl)
    })

    it('should return relative url when url is http', function () {
      var httpUrl = 'http://example.com'
      var protocolRelativeUrl = '//example.com'

      expect(helpers.convertProtocol(httpUrl)).to.equal(protocolRelativeUrl)
    })

    it('should return relative url when url is relative', function () {
      var protocolRelativeUrl = '//example.com'

      expect(helpers.convertProtocol(protocolRelativeUrl)).to.equal(protocolRelativeUrl)
    })
  })

  describe('isNonEmptyString', function () {
    it('should return true if non blank string', function () {
      var url = 'url'

      expect(helpers.isNonEmptyString(url)).to.equal(true)
    })

    it('should return false if undefined', function () {
      expect(helpers.isNonEmptyString(undefined)).to.equal(false)
    })

    it('should return false if blank string', function () {
      var url = ' '

      expect(helpers.isNonEmptyString(url)).to.equal(false)
    })
  })
})

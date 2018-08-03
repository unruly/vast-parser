import VastIcon from '../../../src/model/vastIcon'

describe('VAST Icon', function () {
  var iconXMLJson

  beforeEach(function () {
    iconXMLJson = {
      '@program': 'AdChoices',
      '@width': '60',
      '@height': '20',
      '@xPosition': 'right',
      '@yPosition': 'top',
      'StaticResource': {
        '@creativeType': 'image/jpeg',
        'nodeValue': 'http://example.com/inline/icon.jpeg'
      },
      'IconClicks': {
        'IconClickThrough': {
          'nodeValue': 'http://example.com/inline/icon-click-through'
        },
        'IconClickTracking': [
          {
            'nodeValue': '//example.com/inline/icon-click-tracking-1'
          },
          {
            'nodeValue': 'http://example.com/inline/icon-click-tracking-2'
          }
        ]
      }
    }
  })

  describe('when elements are missing', function () {
    it('does not throw', function () {
      expect(() => new VastIcon({})).to.not.throw()
    })

    it('has sensible defaults', function () {
      var icon = new VastIcon({})

      expect(icon.program).to.equal('unknown')
      expect(icon.width).to.equal(0)
      expect(icon.height).to.equal(0)
      expect(icon.xPosition).to.equal('top')
      expect(icon.yPosition).to.equal('right')
      expect(icon.clickThrough).to.equal('')
      expect(icon.resource).to.deep.equal({
        type: '',
        url: ''
      })
      expect(icon.clickTracking).to.have.length(0)
    })
  })

  describe('constructor', function () {
    var icon

    beforeEach(function () {
      icon = new VastIcon(iconXMLJson)
    })

    it('program property', function () {
      expect(icon.program).to.equal('AdChoices')
    })

    it('width property', function () {
      expect(icon.width).to.equal(60)
    })

    it('height property', function () {
      expect(icon.height).to.equal(20)
    })

    it('xPosition property', function () {
      expect(icon.xPosition).to.equal('right')
    })

    it('yPosition property', function () {
      expect(icon.yPosition).to.equal('top')
    })

    describe('resource property', function () {
      it('type property', function () {
        expect(icon.resource.type).to.equal('image/jpeg')
      })

      it('url property', function () {
        expect(icon.resource.url).to.equal('//example.com/inline/icon.jpeg')
      })
    })

    it('clickThrough property', function () {
      expect(icon.clickThrough).to.equal('//example.com/inline/icon-click-through')
    })

    describe('clickTracking property', function () {
      it('should support a single value', function () {
        iconXMLJson.IconClicks.IconClickTracking.splice(1, 1)
        icon = new VastIcon(iconXMLJson)
        expect(icon.clickTracking.length).to.equal(1)
        expect(icon.clickTracking[0]).to.equal('//example.com/inline/icon-click-tracking-1')
      })

      it('should support multiple values', function () {
        expect(icon.clickTracking.length).to.equal(2)
        expect(icon.clickTracking[0]).to.equal('//example.com/inline/icon-click-tracking-1')
        expect(icon.clickTracking[1]).to.equal('//example.com/inline/icon-click-tracking-2')
      })

      it('should support no values', function () {
        iconXMLJson.IconClicks.IconClickTracking.splice(0, 2)
        icon = new VastIcon(iconXMLJson)
        expect(icon.clickTracking.length).to.equal(0)
      })
    })
  })
})

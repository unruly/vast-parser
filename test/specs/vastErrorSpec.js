import VastError from '../../src/vastError'
import VastResponse from '../../src/model/vastResponse'

describe('VAST Error', function () {
  it('should be possible to get the code', function () {
    expect(new VastError(101).code).to.equal(101)
  })

  describe('message', function () {
    it('should be parsing error for 100', function () {
      expect(new VastError(100).message).to.contain('XML parsing error.')
    })

    it('should be wrapper error for 300', function () {
      expect(new VastError(300).message).to.contain('General Wrapper error.')
    })

    it('should be unknown error code for 999999', function () {
      expect(new VastError(999999).message).to.contain('Unknown error code')
    })

    it('should be our own error message when supplied to VastError', function () {
      var vastError = new VastError(300, new VastResponse(), 'My Error Message')
      expect(vastError.message).to.contain('My Error Message')
      expect(vastError.message).to.contain('300')
    })
  })

  describe('vastResponse', function () {
    it('should hold on to the VastResponse object passed in', function () {
      var vastResponse = new VastResponse()

      var vastError = new VastError(100, vastResponse, 'My error message')

      expect(vastError.vastResponse).to.equal(vastResponse)
    })
  })

  describe('getErrorURIs', function () {
    it('should return an empty array if no vast tags passed in', function () {
      var vastError = new VastError(300, 'My Error Message')
      expect(vastError.getErrorURIs()).to.deep.equals([])
    })

    it('should return any error pixels from a wrapper', function () {
      var errorPixel = 'http://example.com/error/ERRORCODE'
      var vastResponse = new VastResponse({
        wrappers: [
          {
            'VAST': {
              'Ad': {
                'Wrapper': {
                  'Error': [{
                    'nodeValue': errorPixel
                  }]
                }
              }
            }
          }
        ]
      })

      var vastError = new VastError(101, vastResponse, 'Some message about errors')

      expect(vastError.getErrorURIs()).to.deep.equal([errorPixel])
    })

    it('should return any error pixels from the VAST element when on a wrapper', function () {
      var errorPixel = 'http://example.com/error/ERRORCODE'
      var vastResponse = new VastResponse({
        wrappers: [
          {
            'VAST': {
              'Error': [{
                'nodeValue': errorPixel
              }],
              'Ad': {
                'Wrapper': {}
              }
            }
          }
        ]
      })

      var vastError = new VastError(101, vastResponse, 'Some message about errors')

      expect(vastError.getErrorURIs()).to.deep.equal([errorPixel])
    })

    it('should return any error pixel from the inline Ad element', function () {
      var errorPixel = 'http://example.com/error/ERRORCODE'
      var vastResponse = new VastResponse({
        inline: {
          'VAST': {
            'Ad': {
              'InLine': {
                'Error': [{
                  'nodeValue': errorPixel
                }]
              }
            }
          }
        }
      })

      var vastError = new VastError(101, vastResponse, 'Some message about errors')

      expect(vastError.getErrorURIs()).to.deep.equal([errorPixel])
    })

    it('should return any error pixels from the VAST element when on the inline file', function () {
      var errorPixel = 'http://example.com/error/ERRORCODE'
      var vastResponse = new VastResponse({
        inline: {
          'VAST': {
            'Error': [{
              'nodeValue': errorPixel
            }],
            'Ad': {
              'InLine': {
              }
            }
          }
        }
      })

      var vastError = new VastError(101, vastResponse, 'Some message about errors')

      expect(vastError.getErrorURIs()).to.deep.equal([errorPixel])
    })

    it('should return any error pixels from both wrappers and the inline', function () {
      var errorPixel1 = 'http://example.com/error/ERRORCODE'

      var errorPixel2 = 'http://example.com/error/ERRORCODE2'

      var errorPixel3 = 'http://example.com/error/ERRORCODE3'

      var vastResponse = new VastResponse({
        wrappers: [
          {
            'VAST': {
              'Ad': {
                'Wrapper': {
                  'Error': [{
                    'nodeValue': errorPixel1
                  },
                  {
                    'nodeValue': errorPixel2
                  }]
                }
              }
            }
          }
        ],
        inline: {
          'VAST': {
            'Ad': {
              'InLine': {
                'Error': [{
                  'nodeValue': errorPixel3
                }]
              }
            }
          }
        }
      })

      var vastError = new VastError(101, vastResponse, 'Some message about errors')

      expect(vastError.getErrorURIs()).to.contain(errorPixel1)
      expect(vastError.getErrorURIs()).to.contain(errorPixel2)
      expect(vastError.getErrorURIs()).to.contain(errorPixel3)
      expect(vastError.getErrorURIs()).to.have.length(3)
    })

    it('should not include any error pixels that lack nodeValues', function () {
      var vastResponse = new VastResponse({
        wrappers: [
          {
            'VAST': {
              'Ad': {
                'Wrapper': {
                  'Error': [{}]
                }
              }
            }
          }
        ]
      })

      var vastError = new VastError(101, vastResponse, 'Some message about errors')

      expect(vastError.getErrorURIs()).to.deep.equal([])
    })

    it('should not include any error pixels when there are no errors', function () {
      var vastResponse = new VastResponse({
        wrappers: [
          {
            'VAST': {
              'Ad': {
                'Wrapper': {}
              }
            }
          }
        ]
      })

      var vastError = new VastError(101, vastResponse, 'Some message about errors')

      expect(vastError.getErrorURIs()).to.deep.equal([])
    })
  })
})

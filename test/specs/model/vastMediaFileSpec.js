import VastMediaFile from '../../../src/model/vastMediaFile'

describe('VAST Media File', function () {
  describe('url property', function () {
    it('should return URL from MediaFile as it was if it had https:// protocol in the XML', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'https://example.com/videoFile'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.url).to.equal('https://example.com/videoFile')
    })

    it('should return URL from MediaFile as protocol relative if it had http:// in the XML', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'http://example.com/videoFile'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.url).to.equal('//example.com/videoFile')
    })

    it('should return URL from MediaFile as it was if the URL was protocol relative in the XML', function () {
      var mediaFile

      var xmlData = {
        nodeValue: '//example.com/videoFile'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.url).to.equal('//example.com/videoFile')
    })
  })

  describe('apiFramework property', function () {
    it('should return apiFramework from MediaFile', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile',
        '@apiFramework': 'VPAID'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.apiFramework).to.equal('VPAID')
    })

    it('should return apiFramework as undefined when not present on MediaFile', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.apiFramework).to.be.undefined
    })
  })

  describe('type property', function () {
    it('should return type from MediaFile', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile',
        '@type': 'application/x-shockwave-flash'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.type).to.equal('application/x-shockwave-flash')
    })

    it('should return type as undefined when not present on MediaFile', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.type).to.be.undefined
    })
  })

  describe('isMP4 function', function () {
    describe('should return true', function () {
      it('when MIME type is video/mp4 and delivery is progressive', function () {
        var mediaFile

        var xmlData = {
          nodeValue: 'videoFile',
          '@type': 'video/mp4',
          '@delivery': 'progressive'
        }

        mediaFile = new VastMediaFile(xmlData)

        expect(mediaFile.isMP4()).to.be.true
      })
    })

    describe('should return false', function () {
      it('when MIME type is video/mp4 and delivery is not progressive', function () {
        var mediaFile

        var xmlData = {
          nodeValue: 'videoFile',
          '@type': 'video/mp4',
          '@delivery': 'streaming'
        }

        mediaFile = new VastMediaFile(xmlData)

        expect(mediaFile.isMP4()).to.be.false
      })

      it('when MIME type is video/flv and delivery is progressive', function () {
        var mediaFile

        var xmlData = {
          nodeValue: 'videoFile',
          '@type': 'video/flv',
          '@delivery': 'progressive'
        }

        mediaFile = new VastMediaFile(xmlData)

        expect(mediaFile.isMP4()).to.be.false
      })
    })
  })

  describe('isFlashVPAID function', function () {
    describe('should return true', function () {
      it('when MIME type is application/x-shockwave-flash and apiFramework is VPAID', function () {
        var mediaFile

        var xmlData = {
          nodeValue: 'videoFile',
          '@type': 'application/x-shockwave-flash',
          '@apiFramework': 'VPAID'
        }

        mediaFile = new VastMediaFile(xmlData)

        expect(mediaFile.isFlashVPAID()).to.be.true
      })
    })

    describe('should return false', function () {
      it('when MIME type is video/flv', function () {
        var mediaFile

        var xmlData = {
          nodeValue: 'videoFile',
          '@type': 'video/flv',
          '@delivery': 'streaming'
        }

        mediaFile = new VastMediaFile(xmlData)

        expect(mediaFile.isFlashVPAID()).to.be.false
      })

      it('when apiFramework is VPAID but MIME type is application/javascript', function () {
        var mediaFile

        var xmlData = {
          nodeValue: 'videoFile',
          '@type': 'application/javascript',
          '@apiFramework': 'VPAID'
        }

        mediaFile = new VastMediaFile(xmlData)

        expect(mediaFile.isFlashVPAID()).to.be.false
      })
    })
  })

  describe('isJavascriptVPAID function', function () {
    describe('should return true', function () {
      it('when MIME type is application/javascript and apiFramework is VPAID', function () {
        var mediaFile

        var xmlData = {
          nodeValue: 'videoFile',
          '@type': 'application/javascript',
          '@apiFramework': 'VPAID'
        }

        mediaFile = new VastMediaFile(xmlData)

        expect(mediaFile.isJavascriptVPAID()).to.be.true
      })
    })

    describe('should return false', function () {
      it('when MIME type is video/flv', function () {
        var mediaFile

        var xmlData = {
          nodeValue: 'videoFile',
          '@type': 'video/flv',
          '@delivery': 'streaming'
        }

        mediaFile = new VastMediaFile(xmlData)

        expect(mediaFile.isJavascriptVPAID()).to.be.false
      })

      it('when apiFramework is VPAID but MIME type is application/x-shockwave-flash', function () {
        var mediaFile

        var xmlData = {
          nodeValue: 'videoFile',
          '@type': 'application/x-shockwave-flash',
          '@apiFramework': 'VPAID'
        }

        mediaFile = new VastMediaFile(xmlData)

        expect(mediaFile.isJavascriptVPAID()).to.be.false
      })
    })
  })

  describe('width property', function () {
    it('should return width from MediaFile', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile',
        '@width': '300'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.width).to.equal(300)
    })

    it('should not set width when it is a string', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile',
        '@width': 'abc'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.width).to.be.undefined
    })

    it('should return width as undefined when not present on MediaFile', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.width).to.be.undefined
    })
  })

  describe('height property', function () {
    it('should return height from MediaFile', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile',
        '@height': '200'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.height).to.equal(200)
    })

    it('should not set height when it is a string', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile',
        '@height': 'abc'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.height).to.be.undefined
    })

    it('should return height as undefined when not present on MediaFile', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.height).to.be.undefined
    })
  })

  describe('delivery property', function () {
    it('should return delivery from MediaFile', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile',
        '@delivery': 'progressive'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.delivery).to.equal('progressive')
    })

    it('should return delivery as undefined when not present on MediaFile', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.delivery).to.be.undefined
    })
  })

  describe('bitrate property', function () {
    it('should return bitrate from MediaFile', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile',
        '@bitrate': '600'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.bitrate).to.equal(600)
    })

    it('should not set bitrate when it is a string', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile',
        '@bitrate': 'abc'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.bitrate).to.be.undefined
    })

    it('should return bitrate as undefined when not present on MediaFile', function () {
      var mediaFile

      var xmlData = {
        nodeValue: 'videoFile'
      }

      mediaFile = new VastMediaFile(xmlData)

      expect(mediaFile.bitrate).to.be.undefined
    })
  })
})

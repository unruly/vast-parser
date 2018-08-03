import VastLinearCreative from '../../../src/model/vastLinearCreative'

describe('VAST Linear Creative', function () {
  var mockVastResponse

  function getVastResponse () {
    return {
      wrappers: [
        {
          'VAST': {
            'Ad': {
              'Wrapper': {
                'AdSystem': {
                  'nodeValue': 'Test Ad Server',
                  '@version': 1
                },
                'VASTAdTagURI': {
                  'nodeValue': 'http://example.com/native/vast/inlines/test_vast_inline_with-linear-ad.xml'
                },
                'Error': {
                  'nodeValue': 'http://example.com/error/ERRORCODE'
                },
                'Impression': [
                  {
                    'nodeValue': 'http://example.com/imp?d=[CACHEBUSTER]'
                  },
                  {
                    'nodeValue': 'http://example.com/another-imp?d=[CACHEBUSTER]'
                  }
                ],
                'Creatives': {
                  'Creative': [{
                    'Linear': {
                      'VideoClicks': {
                        'ClickTracking': [
                          {
                            'nodeValue': 'http://example.com/video-click1?d=[CACHEBUSTER]'
                          },
                          {
                            'nodeValue': 'http://example.com/video-click2?d=[CACHEBUSTER]'
                          }
                        ]
                      },
                      TrackingEvents: {
                        Tracking: [
                          {
                            '@event': 'midpoint',
                            nodeValue: 'https://example.com/blank.gif?t=midpoint1'
                          },
                          {
                            '@event': 'complete',
                            nodeValue: '//example.com/blank.gif?t=complete'
                          }
                        ]
                      },
                      'Icons': {
                        'Icon': [{
                          '@program': 'AdChoices',
                          '@width': '60',
                          '@height': '20',
                          '@xPosition': 'right',
                          '@yPosition': 'top',
                          'StaticResource': {
                            '@creativeType': 'image/jpeg',
                            'nodeValue': 'http://example.com/wrapper/icon.jpeg'
                          },
                          'IconClicks': {
                            'IconClickThrough': {
                              'nodeValue': 'http://example.com/wrapper/icon-click-through'
                            },
                            'IconClickTracking': {
                              'nodeValue': 'http://example.com/wrapper/icon-click-tracking'
                            }
                          }
                        }]
                      }
                    }
                  }]
                }
              },
              '@id': 1,
              '@sequence': 1
            },
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@version': 3,
            '@xsi:noNamespaceSchemaLocation': '../../../../../../../vast/vast3_draft.xsd'
          }
        },
        {
          'VAST': {
            'Ad': {
              'Wrapper': {
                'AdSystem': {
                  'nodeValue': 'Test Ad Server',
                  '@version': 1
                },
                'VASTAdTagURI': {
                  'nodeValue': 'http://localhost/test/resources/vast/inlines/test_vast_inline_with-linear-ad.xml'
                },
                'Error': {
                  'nodeValue': 'http://example.com/error/ERRORCODE'
                },
                'Impression': [
                  {
                    'nodeValue': 'http://example.com/impression_two_one'
                  },
                  {
                    'nodeValue': 'http://example.com/impression_two_two'
                  }
                ],
                'Creatives': {
                  'Creative': [{
                    'Linear': {
                      'VideoClicks': {
                        'ClickTracking': [
                          {
                            'nodeValue': 'http://example.com/video-click3?d=[CACHEBUSTER]'
                          },
                          {
                            'nodeValue': 'http://example.com/video-click4?d=[CACHEBUSTER]'
                          }
                        ]
                      },
                      TrackingEvents: {
                        Tracking: [
                          {
                            '@event': 'midpoint',
                            nodeValue: 'http://example.com/blank.gif?t=midpoint2'
                          },
                          {
                            '@event': 'midpoint',
                            nodeValue: '//example.com/blank.gif?t=midpoint3'
                          }
                        ]
                      }
                    }
                  }]
                }
              },
              '@id': 1,
              '@sequence': 1
            },
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@version': 3,
            '@xsi:noNamespaceSchemaLocation': '../../../../../../../vast/vast3_draft.xsd'
          }
        }
      ],
      inline: {
        'VAST': {
          'Ad': {
            'InLine': {
              'AdSystem': {
                'nodeValue': 'Test Ad Server',
                '@version': 1
              },
              'AdTitle': {
                'nodeValue': 'Example Title'
              },
              'Description': {
                'nodeValue': 'Example Description'
              },
              'Impression':
                                [{
                                  'nodeValue': 'http://example.com/impression_two_one'
                                }],
              'Creatives': {
                'Creative': [{
                  'NonLinearAds': {
                    'NonLinear': {
                      'StaticResource': {
                        'nodeValue': 'http://example.com/thumb.jpg',
                        '@creativeType': 'image/jpeg'
                      },
                      'NonLinearClickThrough': [{
                        'nodeValue': 'http://example.com/clickthrough.html'
                      }],
                      '@width': 100,
                      '@height': 100
                    }
                  }
                }, {
                  'Linear': {
                    'Duration': {
                      nodeValue: '00:00:40'
                    },
                    'MediaFiles': {
                      'MediaFile': [{
                        'nodeValue': 'videoUrl'
                      }]
                    },
                    'VideoClicks': {
                      'ClickThrough': {
                        'nodeValue': 'http://example.com/clickthrough'
                      },
                      'ClickTracking': [
                        {
                          'nodeValue': 'http://example.com/video-click5?d=[CACHEBUSTER]'
                        },
                        {
                          'nodeValue': 'http://example.com/video-click6?d=[CACHEBUSTER]'
                        }
                      ]
                    },
                    'AdParameters': {
                      'nodeValue': 'ad parameter'
                    },
                    TrackingEvents: {
                      Tracking: [
                        {
                          '@event': 'midpoint',
                          nodeValue: '//example.com/blank.gif?t=midpoint4'
                        },
                        {
                          '@event': 'withInvalidURL',
                          nodeValue: ' '
                        }
                      ]
                    },
                    'Icons': {
                      'Icon': [
                        {
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
                            'IconClickTracking': {
                              'nodeValue': 'http://example.com/inline/icon-click-tracking'
                            }
                          }
                        },
                        {
                          '@program': 'OptOut',
                          '@width': '60',
                          '@height': '20',
                          '@xPosition': 'right',
                          '@yPosition': 'top',
                          'StaticResource': {
                            '@creativeType': 'image/jpeg',
                            'nodeValue': 'http://example.com/inline/icon-2.jpeg'
                          },
                          'IconClicks': {
                            'IconClickThrough': {
                              'nodeValue': 'http://example.com/inline/icon-click-through-2'
                            },
                            'IconClickTracking': {
                              'nodeValue': 'http://example.com/inline/icon-click-tracking-2'
                            }
                          }
                        }
                      ]
                    }
                  }
                }
                ]
              }
            },
            '@id': 1,
            '@sequence': 1
          },
          '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          '@version': 3,
          '@xsi:noNamespaceSchemaLocation': '../../../../../../../vast/vast3_draft.xsd'
        }
      }
    }
  }

  function overrideMockInlineAndWrapperClickTracking (inlineClickTrackers, wrapperClickTrackers) {
    var inlineTracking,
      wrapperTracking

    mockVastResponse.inline = {
      'VAST': {
        'Ad': {
          'InLine': {
            'Creatives': {
              'Creative': {
                'Linear': {
                  'VideoClicks': {
                    'ClickTracking': []
                  }
                }
              }
            }
          }
        }
      }
    }

    mockVastResponse.wrappers = [{
      'VAST': {
        'Ad': {
          'Wrapper': {
            'Creatives': {
              'Creative': {
                'Linear': {
                  'VideoClicks': {
                    'ClickTracking': []
                  }
                }
              }
            }
          }
        }
      }
    }]

    inlineTracking = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative.Linear.VideoClicks.ClickTracking

    inlineClickTrackers.forEach(function (clickTracker) {
      inlineTracking.push(clickTracker)
    })

    wrapperTracking = mockVastResponse.wrappers[0].VAST.Ad.Wrapper.Creatives.Creative.Linear.VideoClicks.ClickTracking

    wrapperClickTrackers.forEach(function (clickTracker) {
      wrapperTracking.push(clickTracker)
    })
  }

  beforeEach(function () {
    mockVastResponse = getVastResponse()
  })

  describe('getDuration', function () {
    it('should return number in seconds', function () {
      var result

      var expectedResult = 40

      var linearCreative = new VastLinearCreative(mockVastResponse)

      const getSecondsFromTimeString = sinon.stub()
        .withArgs(mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.Duration.nodeValue)
        .returns(expectedResult)

      result = linearCreative.getDuration(getSecondsFromTimeString)

      expect(result).to.equal(expectedResult)
    })
  })

  describe('getVideoClickTracking', function () {
    it('should return an array of all click trackers if no parameter passed', function () {
      var result

      var linearCreative = new VastLinearCreative(mockVastResponse)

      result = linearCreative.getClickTrackers()

      expect(result.length).to.equal(6)
      expect(result).to.contain('//example.com/video-click1?d=[CACHEBUSTER]')
      expect(result).to.contain('//example.com/video-click2?d=[CACHEBUSTER]')
      expect(result).to.contain('//example.com/video-click3?d=[CACHEBUSTER]')
      expect(result).to.contain('//example.com/video-click4?d=[CACHEBUSTER]')
      expect(result).to.contain('//example.com/video-click5?d=[CACHEBUSTER]')
      expect(result).to.contain('//example.com/video-click6?d=[CACHEBUSTER]')
    })

    it('should return an array of click trackers of the specified id and those with no id', function () {
      var result,
        linearCreative

      overrideMockInlineAndWrapperClickTracking(
        [{
          'nodeValue': 'https://example.com/some_click?d=[CACHEBUSTER]',
          '@id': 'some_click'
        },
        {
          'nodeValue': 'https://example.com/post_video_click?d=[CACHEBUSTER]',
          '@id': 'post_video_click'
        },
        {
          'nodeValue': 'https://example.com/post_video_click2?d=[CACHEBUSTER]'
        }],
        [{
          'nodeValue': 'https://example.com/wrapper/some_click?d=[CACHEBUSTER]',
          '@id': 'some_click'
        },
        {
          'nodeValue': 'https://example.com/wrapper/post_video_click?d=[CACHEBUSTER]',
          '@id': 'post_video_click'
        }]
      )

      linearCreative = new VastLinearCreative(mockVastResponse)

      result = linearCreative.getClickTrackers('post_video_click')

      expect(result.length).to.equal(3)
      expect(result).to.contain('https://example.com/post_video_click?d=[CACHEBUSTER]')
      expect(result).to.contain('https://example.com/post_video_click2?d=[CACHEBUSTER]')
      expect(result).to.contain('https://example.com/wrapper/post_video_click?d=[CACHEBUSTER]')
    })

    it('should discard invalid URLs', function () {
      var result,
        linearCreative

      overrideMockInlineAndWrapperClickTracking(
        [{
          'nodeValue': ' '
        }],
        [{
          'nodeValue': 'http://example.com/valid'
        }]
      )

      linearCreative = new VastLinearCreative(mockVastResponse)
      result = linearCreative.getClickTrackers()

      expect(result.length).to.equal(1)
      expect(result).to.contain('//example.com/valid')
    })

    it('should keep https:// url protocols', function () {
      var result,
        linearCreative

      overrideMockInlineAndWrapperClickTracking(
        [{
          'nodeValue': 'https://example.com/video-click5?d=[CACHEBUSTER]'
        }],
        [{
          'nodeValue': 'https://example.com/wrapper/video-click5?d=[CACHEBUSTER]'
        }]
      )

      linearCreative = new VastLinearCreative(mockVastResponse)
      result = linearCreative.getClickTrackers()

      expect(result.length).to.equal(2)
      expect(result).to.contain('https://example.com/video-click5?d=[CACHEBUSTER]')
      expect(result).to.contain('https://example.com/wrapper/video-click5?d=[CACHEBUSTER]')
    })

    it('should remove http:// hardcoded url protocols', function () {
      var result,
        linearCreative

      overrideMockInlineAndWrapperClickTracking(
        [{
          'nodeValue': 'http://example.com/video-click5?d=[CACHEBUSTER]'
        }],
        [{
          'nodeValue': 'http://example.com/wrapper/video-click5?d=[CACHEBUSTER]'
        }]
      )

      linearCreative = new VastLinearCreative(mockVastResponse)
      result = linearCreative.getClickTrackers()

      expect(result.length).to.equal(2)
      expect(result).to.contain('//example.com/video-click5?d=[CACHEBUSTER]')
      expect(result).to.contain('//example.com/wrapper/video-click5?d=[CACHEBUSTER]')
    })

    it('should do nothing with protocols independent urls', function () {
      var result,
        linearCreative

      overrideMockInlineAndWrapperClickTracking(
        [{
          'nodeValue': '//example.com/video-click5?d=[CACHEBUSTER]'
        }],
        [{
          'nodeValue': '//example.com/wrapper/video-click5?d=[CACHEBUSTER]'
        }]
      )

      linearCreative = new VastLinearCreative(mockVastResponse)
      result = linearCreative.getClickTrackers()

      expect(result.length).to.equal(2)
      expect(result).to.contain('//example.com/video-click5?d=[CACHEBUSTER]')
      expect(result).to.contain('//example.com/wrapper/video-click5?d=[CACHEBUSTER]')
    })
  })

  describe('getAllClickTrackersAsMap', function () {
    it('should return a map of all click tracking events grouped by @id', function () {
      overrideMockInlineAndWrapperClickTracking(
        [
          {
            'nodeValue': 'http://example.com/event2',
            '@id': 'event2'
          },
          {
            'nodeValue': 'http://example.com/unknown1'
          }
        ],
        [
          {
            'nodeValue': 'http://example.com/event1',
            '@id': 'event1'
          },
          {
            'nodeValue': 'http://example.com/unknown2'
          },
          {
            'nodeValue': 'http://example.com/event2b',
            '@id': 'event2'
          }
        ]
      )

      var result

      var linearCreative = new VastLinearCreative(mockVastResponse)

      var expectedResult = {
        'unknown': [
          '//example.com/unknown1',
          '//example.com/unknown2'
        ],
        'event1': [
          '//example.com/event1'
        ],
        'event2': [
          '//example.com/event2',
          '//example.com/event2b'
        ]
      }

      result = linearCreative.getAllClickTrackersAsMap()

      expect(result).to.have.keys(['unknown', 'event1', 'event2'])
      Object.keys(expectedResult).forEach(function (group) {
        expect(result[group]).to.have.members(expectedResult[group])
      })
    })

    it('should group events without @id as "unknown"', function () {
      var result

      var linearCreative = new VastLinearCreative(mockVastResponse)

      var expectedResult = {
        'unknown': [
          '//example.com/video-click1?d=[CACHEBUSTER]',
          '//example.com/video-click2?d=[CACHEBUSTER]',
          '//example.com/video-click3?d=[CACHEBUSTER]',
          '//example.com/video-click4?d=[CACHEBUSTER]',
          '//example.com/video-click5?d=[CACHEBUSTER]',
          '//example.com/video-click6?d=[CACHEBUSTER]'
        ]
      }

      result = linearCreative.getAllClickTrackersAsMap()

      expect(result).to.have.keys(['unknown'])
      expect(result.unknown).to.have.members(expectedResult.unknown)
    })

    it('should discard invalid URLs', function () {
      var result,
        linearCreative

      overrideMockInlineAndWrapperClickTracking(
        [{
          'nodeValue': ' '
        }],
        [{
          'nodeValue': 'http://example.com/valid'
        }]
      )

      linearCreative = new VastLinearCreative(mockVastResponse)
      result = linearCreative.getAllClickTrackersAsMap().unknown

      expect(result).to.have.members(['//example.com/valid'])
    })

    it('should keep https:// url protocols', function () {
      var result,
        linearCreative

      overrideMockInlineAndWrapperClickTracking(
        [{
          'nodeValue': 'https://example.com/video-click5?d=[CACHEBUSTER]'
        }],
        [{
          'nodeValue': 'https://example.com/wrapper/video-click5?d=[CACHEBUSTER]'
        }]
      )

      linearCreative = new VastLinearCreative(mockVastResponse)
      result = linearCreative.getAllClickTrackersAsMap().unknown
      var expectedResult = [
        'https://example.com/video-click5?d=[CACHEBUSTER]',
        'https://example.com/wrapper/video-click5?d=[CACHEBUSTER]'
      ]
      expect(result).to.have.members(expectedResult)
    })

    it('should remove http:// hardcoded url protocols', function () {
      var result,
        linearCreative

      overrideMockInlineAndWrapperClickTracking(
        [{
          'nodeValue': 'http://example.com/video-click5?d=[CACHEBUSTER]'
        }],
        [{
          'nodeValue': 'http://example.com/wrapper/video-click5?d=[CACHEBUSTER]'
        }]
      )

      linearCreative = new VastLinearCreative(mockVastResponse)
      result = linearCreative.getAllClickTrackersAsMap().unknown

      var expectedResult = [
        '//example.com/video-click5?d=[CACHEBUSTER]',
        '//example.com/wrapper/video-click5?d=[CACHEBUSTER]'
      ]
      expect(result).to.have.members(expectedResult)
    })

    it('should do nothing with protocols independent urls', function () {
      var result,
        linearCreative

      overrideMockInlineAndWrapperClickTracking(
        [{
          'nodeValue': '//example.com/video-click5?d=[CACHEBUSTER]'
        }],
        [{
          'nodeValue': '//example.com/wrapper/video-click5?d=[CACHEBUSTER]'
        }]
      )

      linearCreative = new VastLinearCreative(mockVastResponse)
      result = linearCreative.getAllClickTrackersAsMap().unknown

      var expectedResult = [
        '//example.com/video-click5?d=[CACHEBUSTER]',
        '//example.com/wrapper/video-click5?d=[CACHEBUSTER]'
      ]
      expect(result).to.have.members(expectedResult)
    })
  })

  describe('Media Files', function () {
    beforeEach(function () {
      var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear
      linearCreativeXml.MediaFiles.MediaFile.push({
        nodeValue: 'http://example.com/video.mp4'
      })
    })

    describe('getMediaFiles', function () {
      it('should return all MediaFile objects when no filter supplied', function () {
        var mediaFiles

        var linearCreative = new VastLinearCreative(mockVastResponse)

        mediaFiles = linearCreative.getMediaFiles()

        expect(mediaFiles.length).to.equal(2)
        expect(mediaFiles[0].url).to.equal('videoUrl')
        expect(mediaFiles[1].url).to.equal('//example.com/video.mp4')
      })

      it('should return all MediaFile objects when an empty filter is supplied', function () {
        var mediaFiles

        var linearCreative = new VastLinearCreative(mockVastResponse)

        var filter = {}

        mediaFiles = linearCreative.getMediaFiles(filter)

        expect(mediaFiles.length).to.equal(2)
        expect(mediaFiles[0].url).to.equal('videoUrl')
        expect(mediaFiles[1].url).to.equal('//example.com/video.mp4')
      })

      it('should return filtered array of MediaFile objects', function () {
        var mediaFiles

        var linearCreative = new VastLinearCreative(mockVastResponse)

        var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear

        var filter = {type: 'type/mp4'}

        linearCreativeXml.MediaFiles.MediaFile.push({
          nodeValue: 'http://example.com/expected.mp4',
          '@type': 'type/mp4'
        })

        mediaFiles = linearCreative.getMediaFiles(filter)

        expect(mediaFiles.length).to.equal(1)
        expect(mediaFiles[0].url).to.equal('//example.com/expected.mp4')
      })
    })

    describe('hasFlashVPAID', function () {
      it('should return false when no VPAID creative found', function () {
        var linearCreative = new VastLinearCreative(mockVastResponse)

        expect(linearCreative.hasFlashVPAID()).to.be.false
      })

      it('should return true when a VPAID MediaFile found', function () {
        var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear
        linearCreativeXml.MediaFiles.MediaFile.push({
          nodeValue: 'http://example.com/vpaid.js',
          '@type': 'application/javascript',
          '@apiFramework': 'VPAID'
        })

        var linearCreative = new VastLinearCreative(mockVastResponse)

        expect(linearCreative.hasFlashVPAID()).to.be.false
      })

      it('should return true when a VPAID MediaFile found', function () {
        var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear
        linearCreativeXml.MediaFiles.MediaFile.push({
          nodeValue: 'http://example.com/vpaid.swf',
          '@type': 'application/x-shockwave-flash',
          '@apiFramework': 'VPAID'
        })

        var linearCreative = new VastLinearCreative(mockVastResponse)

        expect(linearCreative.hasFlashVPAID()).to.be.true
      })
    })

    describe('getFlashVPAIDMediaFiles', function () {
      it('should return empty array when no flash VPAID creatives found', function () {
        var mediaFiles

        var linearCreative = new VastLinearCreative(mockVastResponse)

        mediaFiles = linearCreative.getFlashVPAIDMediaFiles()

        expect(mediaFiles).to.deep.equal([])
      })

      it('should return array of VastMediaFile objects for flash VPAID MediaFiles found', function () {
        var mediaFiles

        var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear
        linearCreativeXml.MediaFiles.MediaFile.push({
          nodeValue: 'http://example.com/vpaid.swf',
          '@type': 'application/x-shockwave-flash',
          '@apiFramework': 'VPAID'
        })

        var linearCreative = new VastLinearCreative(mockVastResponse)

        mediaFiles = linearCreative.getFlashVPAIDMediaFiles()

        expect(mediaFiles.length).to.equal(1)
        expect(mediaFiles[0].url).to.equal('//example.com/vpaid.swf')
      })
    })

    describe('hasJavascriptVPAID', function () {
      it('should return false when no VPAID creative found', function () {
        var linearCreative = new VastLinearCreative(mockVastResponse)

        expect(linearCreative.hasJavascriptVPAID()).to.be.false
      })

      it('should return true when a VPAID MediaFile found', function () {
        var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear
        linearCreativeXml.MediaFiles.MediaFile.push({
          nodeValue: 'http://example.com/vpaid.swf',
          '@type': 'application/x-shockwave-flash',
          '@apiFramework': 'VPAID'
        })

        var linearCreative = new VastLinearCreative(mockVastResponse)

        expect(linearCreative.hasJavascriptVPAID()).to.be.false
      })

      it('should return true when a VPAID MediaFile found', function () {
        var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear
        linearCreativeXml.MediaFiles.MediaFile.push({
          nodeValue: 'http://example.com/vpaid.js',
          '@type': 'application/javascript',
          '@apiFramework': 'VPAID'
        })

        var linearCreative = new VastLinearCreative(mockVastResponse)

        expect(linearCreative.hasJavascriptVPAID()).to.be.true
      })
    })

    describe('getJavascriptVPAIDMediaFiles', function () {
      it('should return empty array when no javascript VPAID creatives found', function () {
        var mediaFiles

        var linearCreative = new VastLinearCreative(mockVastResponse)

        mediaFiles = linearCreative.getJavascriptVPAIDMediaFiles()

        expect(mediaFiles).to.deep.equal([])
      })

      it('should return array of VastMediaFile objects for javascript VPAID MediaFiles found', function () {
        var mediaFiles

        var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear
        linearCreativeXml.MediaFiles.MediaFile.push({
          nodeValue: 'http://example.com/vpaid.js',
          '@type': 'application/javascript',
          '@apiFramework': 'VPAID'
        })

        var linearCreative = new VastLinearCreative(mockVastResponse)

        mediaFiles = linearCreative.getJavascriptVPAIDMediaFiles()

        expect(mediaFiles.length).to.equal(1)
        expect(mediaFiles[0].url).to.equal('//example.com/vpaid.js')
      })
    })

    describe('hasMp4', function () {
      it('should return false when no mp4 file MediaFile found', function () {
        var linearCreative = new VastLinearCreative(mockVastResponse)

        expect(linearCreative.hasMp4()).to.be.false
      })

      it('should return false when a flv file type MediaFile found', function () {
        var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear
        linearCreativeXml.MediaFiles.MediaFile.push({
          nodeValue: 'http://example.com/vpaid.flv',
          '@type': 'video/x-flv'
        })

        var linearCreative = new VastLinearCreative(mockVastResponse)

        expect(linearCreative.hasMp4()).to.be.false
      })

      it('should return false when a streaming mp4 file type MediaFile found', function () {
        var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear
        linearCreativeXml.MediaFiles.MediaFile.push({
          nodeValue: 'http://example.com/vpaid.mp4',
          '@type': 'video/mp4',
          '@delivery': 'streaming'
        })

        var linearCreative = new VastLinearCreative(mockVastResponse)

        expect(linearCreative.hasMp4()).to.be.false
      })

      it('should return true when a progressive mp4 file type MediaFile found', function () {
        var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear
        linearCreativeXml.MediaFiles.MediaFile.push({
          nodeValue: 'http://example.com/vpaid.mp4',
          '@type': 'video/mp4',
          '@delivery': 'progressive'
        })

        var linearCreative = new VastLinearCreative(mockVastResponse)

        expect(linearCreative.hasMp4()).to.be.true
      })
    })

    describe('getMp4MediaFiles', function () {
      it('should return empty array when no mp4 creatives found', function () {
        var mediaFiles

        var linearCreative = new VastLinearCreative(mockVastResponse)

        mediaFiles = linearCreative.getMp4MediaFiles()

        expect(mediaFiles).to.deep.equal([])
      })

      it('should return empty array when only streaming mp4 MediaFiles found', function () {
        var mediaFiles

        var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear
        linearCreativeXml.MediaFiles.MediaFile.push({
          nodeValue: 'http://example.com/vpaid.mp4',
          '@type': 'video/mp4',
          '@delivery': 'streaming'
        })

        var linearCreative = new VastLinearCreative(mockVastResponse)

        mediaFiles = linearCreative.getMp4MediaFiles()

        expect(mediaFiles).to.deep.equal([])
      })

      it('should return array of VastMediaFile objects for progressive mp4 MediaFiles found', function () {
        var mediaFiles

        var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear
        linearCreativeXml.MediaFiles.MediaFile.push({
          nodeValue: 'http://example.com/vpaid.mp4',
          '@type': 'video/mp4',
          '@delivery': 'progressive'
        })

        var linearCreative = new VastLinearCreative(mockVastResponse)

        mediaFiles = linearCreative.getMp4MediaFiles()

        expect(mediaFiles.length).to.equal(1)
        expect(mediaFiles[0].url).to.equal('//example.com/vpaid.mp4')
      })
    })

    describe('getClickThrough', function () {
      it('should return undefined if VideoClicks is not present', function () {
        mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks = undefined

        var linearCreative = new VastLinearCreative(mockVastResponse)

        var clickThrough

        clickThrough = linearCreative.getClickThrough()

        expect(clickThrough).to.be.undefined
      })

      it('should return undefined if ClickThrough is not present', function () {
        mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickThrough = undefined

        var linearCreative = new VastLinearCreative(mockVastResponse)

        var clickThrough

        clickThrough = linearCreative.getClickThrough()

        expect(clickThrough).to.be.undefined
      })

      it('should return the url if ClickThrough is present', function () {
        var linearCreative = new VastLinearCreative(mockVastResponse)

        var clickThrough

        clickThrough = linearCreative.getClickThrough()

        expect(clickThrough).to.equal('http://example.com/clickthrough')
      })
    })

    describe('getAdParameters', function () {
      it('should return undefined when no AdParameters', function () {
        mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.AdParameters = undefined
        var linearCreative = new VastLinearCreative(mockVastResponse)

        var adParameters

        adParameters = linearCreative.getAdParameters()

        expect(adParameters).to.be.undefined
      })

      it('should return the ad parameters when they are present', function () {
        var linearCreative = new VastLinearCreative(mockVastResponse)

        var adParameters

        adParameters = linearCreative.getAdParameters()

        expect(adParameters).to.equal('ad parameter')
      })

      it('should return the original ad parameters nodeValue when attribute xmlEncoded is false', function () {
        mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.AdParameters = {
          nodeValue: '{&quot;test&quot;:true,&quot;url&quot;:&quot;http://example.com?a=1&amp;b=2&quot;,&apos;string&apos;:&apos;&lt;&gt;&apos;}',
          '@xmlEncoded': 'false'
        }

        var linearCreative = new VastLinearCreative(mockVastResponse)

        var adParameters

        adParameters = linearCreative.getAdParameters()

        expect(adParameters).to.equal('{&quot;test&quot;:true,&quot;url&quot;:&quot;http://example.com?a=1&amp;b=2&quot;,&apos;string&apos;:&apos;&lt;&gt;&apos;}')
      })

      it('should return the decoded ad parameters when attribute xmlEncoded is true and node value is a string', function () {
        mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.AdParameters = {
          nodeValue: '{&quot;test&quot;:true,&quot;url&quot;:&quot;http://example.com?a=1&amp;b=2&quot;,&apos;string&apos;:&apos;&lt;&gt;&apos;}',
          '@xmlEncoded': 'true'
        }

        var linearCreative = new VastLinearCreative(mockVastResponse)

        var adParameters

        adParameters = linearCreative.getAdParameters()

        expect(adParameters).to.equal('{"test":true,"url":"http://example.com?a=1&b=2",\'string\':\'<>\'}')
      })

      it('should return the original ad parameters nodeValue when attribute xmlEncoded true but node value is not a string', function () {
        mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.AdParameters = {
          nodeValue: 0,
          '@xmlEncoded': 'true'
        }

        var linearCreative = new VastLinearCreative(mockVastResponse)

        var adParameters

        adParameters = linearCreative.getAdParameters()

        expect(adParameters).to.equal(0)
      })
    })

    describe('getTrackingEvents', function () {
      it('should return all tracking events for event midpoint', function () {
        var linearCreative = new VastLinearCreative(mockVastResponse)

        var trackingEvents

        trackingEvents = linearCreative.getTrackingEvents('midpoint')

        expect(trackingEvents.length).to.be.equal(4)
        expect(trackingEvents[0]).to.equal('//example.com/blank.gif?t=midpoint4')
        expect(trackingEvents[1]).to.equal('https://example.com/blank.gif?t=midpoint1')
        expect(trackingEvents[2]).to.equal('//example.com/blank.gif?t=midpoint2')
        expect(trackingEvents[3]).to.equal('//example.com/blank.gif?t=midpoint3')
      })

      it('should return all tracking events for event complete', function () {
        var linearCreative = new VastLinearCreative(mockVastResponse)

        var trackingEvents

        trackingEvents = linearCreative.getTrackingEvents('complete')

        expect(trackingEvents.length).to.be.equal(1)
        expect(trackingEvents[0]).to.equal('//example.com/blank.gif?t=complete')
      })

      it('should return empty array for events that can\'t be found', function () {
        var linearCreative = new VastLinearCreative(mockVastResponse)

        var trackingEvents

        trackingEvents = linearCreative.getTrackingEvents('something')

        expect(trackingEvents.length).to.be.equal(0)
      })

      it('should discard events with blank URLs', function () {
        var linearCreative = new VastLinearCreative(mockVastResponse)

        var trackingEvents

        trackingEvents = linearCreative.getTrackingEvents('withInvalidURL')

        expect(trackingEvents.length).to.be.equal(0)
      })
    })
  })

  describe('getIcons', function () {
    it('should return one icon for the linear creative', function () {
      var linearCreative = new VastLinearCreative(mockVastResponse)

      var icons

      delete mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.Icons

      icons = linearCreative.getIcons()
      expect(Object.keys(icons).length).to.be.equal(1)
      expect(icons.AdChoices.resource.url).to.equal('//example.com/wrapper/icon.jpeg')
    })

    it('should return only the closest icons to the linear creative (prefer inline icons to wrapper\'s)', function () {
      var linearCreative = new VastLinearCreative(mockVastResponse)

      var icons = linearCreative.getIcons()

      expect(Object.keys(icons).length).to.be.equal(2)
      expect(icons.AdChoices.resource.url).to.equal('//example.com/inline/icon.jpeg')
      expect(icons.OptOut.resource.url).to.equal('//example.com/inline/icon-2.jpeg')
    })

    it('should return an empty array is no icons are defined', function () {
      delete mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.Icons
      delete mockVastResponse.wrappers[0].VAST.Ad.Wrapper.Creatives.Creative[0].Linear.Icons

      var linearCreative = new VastLinearCreative(mockVastResponse)

      var icons = linearCreative.getIcons()

      expect(icons).to.be.deep.equal({})
    })

    it('should ignore icons with undefined empty program name or "unknown"', function () {
      delete mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.Icons
      delete mockVastResponse.wrappers[0].VAST.Ad.Wrapper.Creatives.Creative[0].Linear.Icons.Icon[0]['@program']

      var linearCreative = new VastLinearCreative(mockVastResponse)

      var icons = linearCreative.getIcons()

      expect(icons).to.be.deep.equal({})
    })
  })
})

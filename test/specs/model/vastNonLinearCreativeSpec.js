import VastNonLinearCreative from '../../../src/model/vastNonLinearCreative'

describe('VAST Non Linear Creative', function () {
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
                          nodeValue: 'not!a!valid!url'
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

  beforeEach(function () {
    mockVastResponse = getVastResponse()
  })

  describe('getStaticResource', function () {
    it('should return undefined if no thumbnail specified', function () {
      delete mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[0].NonLinearAds.NonLinear.StaticResource

      var nonLinearCreative = new VastNonLinearCreative(mockVastResponse)

      var staticResource

      staticResource = nonLinearCreative.getStaticResource()

      expect(staticResource).to.be.undefined
    })

    it('should return convertedUrl if thumbnail specified', function () {
      var nonLinearCreative = new VastNonLinearCreative(mockVastResponse)

      var convertedUrl = '//example.com/thumb.jpg'

      var staticResource

      const convertProtocol = sinon.stub().returns(convertedUrl)

      staticResource = nonLinearCreative.getStaticResource(convertProtocol)

      expect(staticResource).to.equal(convertedUrl)
    })
  })
})

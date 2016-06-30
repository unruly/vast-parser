describe('VAST Response', function() {

    var VastResponse,
        mockVastTags,
        mockVastLinearCreative,
        mockVastNonLinearCreative,
        VastExtension,
        mockVastModelFactory;

    function getValidVastTags() {
        return {
            wrappers: [
                {
                    "VAST": {
                        "Ad": {
                            "Wrapper": {
                                "AdSystem": {
                                    "nodeValue": "Test Ad Server",
                                    "@version": 1
                                },
                                "VASTAdTagURI": {
                                    "nodeValue": "http://localhost/test/resources/vast/inlines/test_vast_inline_with-linear-ad.xml"
                                },
                                "Error": {
                                    "nodeValue": "http://example.com/error/ERRORCODE"
                                },
                                "Impression": [
                                    {
                                        "nodeValue": "http://example.com/imp?d=[CACHEBUSTER]"
                                    },
                                    {
                                        "nodeValue": "http://example.com/another-imp?d=[CACHEBUSTER]"
                                    }
                                ],
                                "Creatives": {
                                    "Creative": [{
                                        "NonLinearAds": {
                                            "NonLinear": {
                                                "NonLinearClickTracking": [{
                                                    "nodeValue": "http://example.com/click"
                                                }]
                                            }
                                        }
                                    }]
                                },
                                "Extensions": {
                                    "Extension": [{
                                        "Property": [
                                            {
                                                "nodeValue": 123,
                                                "@id": "skid"
                                            },
                                            {
                                                "nodeValue": 456,
                                                "@id": "apid"
                                            }
                                        ],
                                        "CustomTrackingEvents": {
                                            "CustomTracking": [
                                                {
                                                    "nodeValue": "http://example.com/share_facebook?d=[CACHEBUSTER]",
                                                    "@event": "share_facebook"
                                                },
                                                {
                                                    "nodeValue": "http://example.com/share_twitter?d=[CACHEBUSTER]",
                                                    "@event": "share_twitter"
                                                },
                                                {
                                                    "nodeValue": "http://example.com/share_googleplus?d=[CACHEBUSTER]",
                                                    "@event": "share_googleplus"
                                                },
                                                {
                                                    "nodeValue": "http://example.com/share_linkedin?d=[CACHEBUSTER]",
                                                    "@event": "share_linkedin"
                                                },
                                                {
                                                    "nodeValue": "http://example.com/share_pinterest?d=[CACHEBUSTER]",
                                                    "@event": "share_pinterest"
                                                },
                                                {
                                                    "nodeValue": "http://example.com/pp_imp2",
                                                    "@event": "pp_imp"
                                                },
                                                {
                                                    "nodeValue": "http://example.com/pp_lb_play",
                                                    "@event": "pp_lb_play"
                                                }
                                            ]
                                        }
                                    }]
                                }
                            },
                            "@id": 1,
                            "@sequence": 1
                        },
                        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                        "@version": 3,
                        "@xsi:noNamespaceSchemaLocation": "../../../../../../../vast/vast3_draft.xsd"
                    }
                },
                {
                    "VAST": {
                        "Ad": {
                            "Wrapper": {
                                "AdSystem": {
                                    "nodeValue": "Test Ad Server",
                                    "@version": 1
                                },
                                "VASTAdTagURI": {
                                    "nodeValue": "http://example.com/native/vast/inlines/test_vast_inline_with-linear-ad.xml"
                                },
                                "Error": {
                                    "nodeValue": "http://example.com/error/ERRORCODE"
                                },
                                "Impression": [
                                    {
                                        "nodeValue": "http://example.com/impression_two_one"
                                    },
                                    {
                                        "nodeValue": "http://example.com/impression_two_two"
                                    }
                                ],
                                "Creatives": {
                                    "Creative": [{
                                        "NonLinearAds": {
                                            "NonLinear": {
                                                "NonLinearClickTracking": [{
                                                    "nodeValue": "http://example.com/click_two_one"
                                                }]
                                            }
                                        }
                                    }]
                                },
                                "Extensions": {
                                    "Extension": [
                                        {
                                            "Property": [
                                                {
                                                    "nodeValue": 1234,
                                                    "@id": "skid"
                                                },
                                                {
                                                    "nodeValue": 5678,
                                                    "@id": "apid"
                                                }
                                            ],
                                            "CustomTrackingEvents": {
                                                "CustomTracking": [
                                                    {
                                                        "nodeValue": "http://example.com/viewable_imp",
                                                        "@event": "viewableImpression"
                                                    },
                                                    {
                                                        "nodeValue": "http://example.com/pp_imp1",
                                                        "@event": "pp_imp"
                                                    },
                                                    {
                                                        "nodeValue": "http://example.com/pp_lb_play",
                                                        "@event": "pp_lb_play"
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "anotherExtension": "more than one!"
                                        }
                                    ]
                                }
                            },
                            "@id": 1,
                            "@sequence": 1
                        },
                        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                        "@version": 3,
                        "@xsi:noNamespaceSchemaLocation": "../../../../../../../vast/vast3_draft.xsd"
                    }
                }
            ],
            inline: {
                "VAST": {
                    "Ad": {
                        "InLine": {
                            "AdSystem": {
                                "nodeValue": "Test Ad Server",
                                "@version": 1
                            },
                            "AdTitle": {
                                "nodeValue": "Example Title"
                            },
                            "Description": {
                                "nodeValue": "Example Description"
                            },
                            "Impression":
                                [{
                                    "nodeValue": "http://example.com/impression_two_one"
                                }],
                            "Creatives": {
                                "Creative": [{
                                    "NonLinearAds": {
                                        "NonLinear": {
                                            "StaticResource": {
                                                "nodeValue": "http://example.com/thumb.jpg",
                                                "@creativeType": "image/jpeg"
                                            },
                                            "NonLinearClickThrough": [{
                                                "nodeValue": "http://example.com/clickthrough.html"
                                            }],
                                            "@width": 100,
                                            "@height": 100
                                        }
                                    }
                                }, {
                                    "Linear": {
                                        "MediaFiles": {
                                            "MediaFile":[{
                                                'nodeValue': 'videoUrl'
                                            }]
                                        },
                                        "VideoClicks": {
                                            "ClickThrough": {
                                                "nodeValue": "http://example.com/video-click?d=[CACHEBUSTER]"
                                            }
                                        }
                                    }
                                }
                                ]
                            },
                            "Extensions": {
                                "Extension": [{
                                    "DisclosureMessage": {
                                        "nodeValue": "A different disclosure message"
                                    },
                                    "SharingUrl": {
                                        "nodeValue": "http://www.twitch.tv/fishplaystreetfighter"
                                    },
                                    "CustomTrackingEvents": {
                                        "CustomTracking": [{
                                            "nodeValue": "http://example.com/inline-viewimp?d=[CACHEBUSTER]",
                                            "@event": "viewableImpression"
                                        }]
                                    }
                                }]
                            }
                        },
                        "@id": 1,
                        "@sequence": 1
                    },
                    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "@version": 3,
                    "@xsi:noNamespaceSchemaLocation": "../../../../../../../vast/vast3_draft.xsd"
                }
            }
        };
    }

    beforeEach(function(done) {
        mockVastTags = getValidVastTags();

        requirejs(['Squire'], function(Squire) {
            var injector = new Squire();

            mockVastModelFactory = {
                createVastExtension: sinon.stub()
            };

            injector
                .store('model/vastLinearCreative')
                .store('model/vastNonLinearCreative')
                .store('model/vastExtension')
                .mock('model/vastModelFactory', mockVastModelFactory)
                .require(['model/vastResponse', 'mocks'], function(module, mocks) {
                    var mockVastLinearCreativeModule =  mocks.store['model/vastLinearCreative'];
                    var mockVastNonLinearCreativeModule =  mocks.store['model/vastNonLinearCreative'];
                    VastResponse = module;
                    mockVastLinearCreative = sinon.stub(mockVastLinearCreativeModule, 'VastLinearCreative');
                    mockVastNonLinearCreative = sinon.stub(mockVastNonLinearCreativeModule, 'VastNonLinearCreative');
                    VastExtension = mocks.store['model/vastExtension'];
                    done();
            });
        });
    });

    it('creates a new object with wrappers and inline properties', function() {
        var vastResponse = new VastResponse(mockVastTags);
        expect(vastResponse).to.have.property('wrappers').that.deep.equals(mockVastTags.wrappers);
        expect(vastResponse).to.have.property('inline').that.deep.equals(mockVastTags.inline);
    });

    describe('getImpression', function() {

        it('creates a new object with wrappers and inline urls', function() {
            var vastResponse = new VastResponse(mockVastTags);

            var vastImpressions = vastResponse.getImpressions();

            expect(vastImpressions.length).to.equal(5);
            expect(vastImpressions).to.contain(mockVastTags.wrappers[0].VAST.Ad.Wrapper.Impression[0].nodeValue);
            expect(vastImpressions).to.contain(mockVastTags.wrappers[0].VAST.Ad.Wrapper.Impression[1].nodeValue);
            expect(vastImpressions).to.contain(mockVastTags.wrappers[1].VAST.Ad.Wrapper.Impression[0].nodeValue);
            expect(vastImpressions).to.contain(mockVastTags.wrappers[1].VAST.Ad.Wrapper.Impression[1].nodeValue);
            expect(vastImpressions).to.contain(mockVastTags.inline.VAST.Ad.InLine.Impression[0].nodeValue);
        });

        it('copes if there are no inline impressions', function() {
            delete mockVastTags.inline.VAST.Ad.InLine.Impression;

            var vastResponse = new VastResponse(mockVastTags);

            var vastImpressions = vastResponse.getImpressions();

            expect(vastImpressions.length).to.equal(4);
            expect(vastImpressions).to.contain(mockVastTags.wrappers[0].VAST.Ad.Wrapper.Impression[0].nodeValue);
            expect(vastImpressions).to.contain(mockVastTags.wrappers[0].VAST.Ad.Wrapper.Impression[1].nodeValue);
            expect(vastImpressions).to.contain(mockVastTags.wrappers[1].VAST.Ad.Wrapper.Impression[0].nodeValue);
            expect(vastImpressions).to.contain(mockVastTags.wrappers[1].VAST.Ad.Wrapper.Impression[1].nodeValue);
        });

        it('copes if there is a wrapper missing impressions', function() {
            delete mockVastTags.wrappers[1].VAST.Ad.Wrapper.Impression;

            var vastResponse = new VastResponse(mockVastTags);

            var vastImpressions = vastResponse.getImpressions();

            expect(vastImpressions.length).to.equal(3);
            expect(vastImpressions).to.contain(mockVastTags.wrappers[0].VAST.Ad.Wrapper.Impression[0].nodeValue);
            expect(vastImpressions).to.contain(mockVastTags.wrappers[0].VAST.Ad.Wrapper.Impression[1].nodeValue);
            expect(vastImpressions).to.contain(mockVastTags.inline.VAST.Ad.InLine.Impression[0].nodeValue);
        });

        it('does not include Impressions that are missing a nodeValue', function() {
            delete mockVastTags.wrappers[1].VAST.Ad.Wrapper.Impression[0].nodeValue;

            var vastResponse = new VastResponse(mockVastTags);
            var vastImpressions = vastResponse.getImpressions();

            expect(vastImpressions).not.to.contain(undefined);
            expect(vastImpressions.length).to.equal(4);
        });

        it('does not include Impressions that are empty values', function() {
            mockVastTags.wrappers[1].VAST.Ad.Wrapper.Impression[0].nodeValue = '';

            var vastResponse = new VastResponse(mockVastTags);
            var vastImpressions = vastResponse.getImpressions();

            expect(vastImpressions).not.to.contain('');
            expect(vastImpressions.length).to.equal(4);
        });

        it('does not include Impressions that are empty values containing whitespace', function() {
            var whitespaceNodeValue = '   ';
            mockVastTags.wrappers[1].VAST.Ad.Wrapper.Impression[0].nodeValue = whitespaceNodeValue;

            var vastResponse = new VastResponse(mockVastTags);
            var vastImpressions = vastResponse.getImpressions();

            expect(vastImpressions).not.to.contain(whitespaceNodeValue);
            expect(vastImpressions.length).to.equal(4);
        });

        it('does not include Impressions that are invalid URLs', function() {
            var invalidNodeValue = ' ';
            mockVastTags.wrappers[1].VAST.Ad.Wrapper.Impression[0].nodeValue = invalidNodeValue;

            var vastResponse = new VastResponse(mockVastTags);
            var vastImpressions = vastResponse.getImpressions();

            expect(vastImpressions).not.to.contain(invalidNodeValue);
            expect(vastImpressions.length).to.equal(4);
        });
    });

    describe('getTitle', function() {
        it('should get the title from the Vast Response', function() {
            var vastResponse = new VastResponse(mockVastTags);

            expect(vastResponse.getAdTitle()).to.be.equal('Example Title');
        });
    });

    describe('getLinearCreative', function() {
        it('should get the linear creative using the Vast Response', function() {
            var vastResponse = new VastResponse(mockVastTags);

            expect(vastResponse.getLinearCreative()).to.be.an.instanceOf(mockVastLinearCreative);
            expect(mockVastLinearCreative).to.be.calledWithNew;
            expect(mockVastLinearCreative).to.be.calledWith(vastResponse);
        });

        it('should not instantiate VastLinearCreative multiple times even if getLinearCreative called multiple times', function() {
            var vastResponse = new VastResponse(mockVastTags);

            vastResponse.getLinearCreative();
            vastResponse.getLinearCreative();

            expect(mockVastLinearCreative).to.be.calledOnce;
        });

        it('should return undefined when no linear creative defined in the Vast Response', function() {
            mockVastTags.inline.VAST.Ad.InLine.Creatives.Creative.pop();

            var vastResponse = new VastResponse(mockVastTags);

            expect(vastResponse.getLinearCreative()).to.be.undefined;
        });
    });

    describe('getNonLinearCreative', function() {
        it('should get the nonlinear creative using the Vast Response', function() {
            var vastResponse = new VastResponse(mockVastTags);

            expect(vastResponse.getNonLinearCreative()).to.be.an.instanceOf(mockVastNonLinearCreative);
            expect(mockVastNonLinearCreative).to.be.calledWithNew;
            expect(mockVastNonLinearCreative).to.be.calledWith(vastResponse);
        });

        it('should not instantiate VastNonLinearCreative multiple times even if getNonLinearCreative called multiple times', function() {
            var vastResponse = new VastResponse(mockVastTags);

            vastResponse.getNonLinearCreative();
            vastResponse.getNonLinearCreative();

            expect(mockVastNonLinearCreative).to.be.calledOnce;
        });

        it('should return undefined when no nonLinear creative defined in the Vast Response', function() {
            mockVastTags.inline.VAST.Ad.InLine.Creatives.Creative.shift();

            var vastResponse = new VastResponse(mockVastTags);

            expect(vastResponse.getNonLinearCreative()).to.be.undefined;
        });
    });

    describe('raw responses', function() {
        it('getRawResponse should return an array of response objects', function() {
            var vastResponse = new VastResponse(mockVastTags),
                data = {
                    url: 'foo',
                    data: '<faketag></faketag>'
                };

            vastResponse._raw.push(data);

            expect(vastResponse.getRawResponses()).to.deep.equal([data]);
        });

        it('addRawResponse should add a response object', function() {
            var vastResponse = new VastResponse(mockVastTags),
                data = {
                    url: 'foo',
                    data: '<faketag></faketag>'
                };
            vastResponse.addRawResponse(data);

            expect(vastResponse._raw[0]).to.deep.equal(data);
        });
    });

    describe('extensions', function() {
        it('getExtension should return an array of VastExtension objects', function() {
            var vastResponse = new VastResponse(mockVastTags),
                extensions;


            extensions = vastResponse.getExtensions();

            expect(extensions.length).to.equal(4);

            expect(mockVastModelFactory.createVastExtension).to.have.been.calledWith(mockVastTags.inline.VAST.Ad.InLine.Extensions.Extension[0]);
            expect(mockVastModelFactory.createVastExtension).to.have.been.calledWith(mockVastTags.wrappers[0].VAST.Ad.Wrapper.Extensions.Extension[0]);
            expect(mockVastModelFactory.createVastExtension).to.have.been.calledWith(mockVastTags.wrappers[1].VAST.Ad.Wrapper.Extensions.Extension[0]);
            expect(mockVastModelFactory.createVastExtension).to.have.been.calledWith(mockVastTags.wrappers[1].VAST.Ad.Wrapper.Extensions.Extension[1]);
        });
    });
});
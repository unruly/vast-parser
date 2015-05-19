describe('VAST Linear Creative', function() {

    var VastLinearCreative,
        mockVastResponse,
        helpers;

    function getVastResponse() {
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
                                    "nodeValue": "http://test.video.unrulymedia.com/native/vast/inlines/test_vast_inline_with-linear-ad.xml"
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
                                        "Linear": {
                                            "VideoClicks": {
                                                "ClickTracking": [
                                                    {
                                                        "nodeValue":  "http://example.com/video-click1?d=[CACHEBUSTER]"
                                                    },
                                                    {
                                                        "nodeValue": "http://example.com/video-click2?d=[CACHEBUSTER]"
                                                    }
                                                ]
                                            }
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
                                    "nodeValue": "http://test.video.unrulymedia.com/native/vast/inlines/test_vast_inline_with-linear-ad.xml"
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
                                        "Linear": {
                                            "VideoClicks": {
                                                "ClickTracking": [
                                                    {
                                                        "nodeValue":  "http://example.com/video-click3?d=[CACHEBUSTER]"
                                                    },
                                                    {
                                                        "nodeValue": "http://example.com/video-click4?d=[CACHEBUSTER]"
                                                    }
                                                ]
                                            }
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
                                        "Duration": {
                                            nodeValue: '00:00:40'
                                        },
                                        "MediaFiles": {
                                            "MediaFile":[{
                                                'nodeValue': 'videoUrl'
                                            }]
                                        },
                                        "VideoClicks": {
                                            "ClickThrough": {
                                                "nodeValue": "http://example.com/clickthrough"
                                            },
                                            "ClickTracking": [
                                                {
                                                    "nodeValue":  "http://example.com/video-click5?d=[CACHEBUSTER]"
                                                },
                                                {
                                                    "nodeValue": "http://example.com/video-click6?d=[CACHEBUSTER]"
                                                }
                                            ]
                                        }
                                    }
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
        };
    }

    beforeEach(function(done) {
        mockVastResponse = getVastResponse();

        requirejs(['Squire'], function(Squire) {
            var injector = new Squire();

            injector
                .store(['util/helpers'])
                .require(['model/vastLinearCreative', 'mocks'], function(module, mocks) {
                    VastLinearCreative = module.VastLinearCreative;
                    helpers = mocks.store['util/helpers'];
                    sinon.stub(helpers, 'getSecondsFromTimeString');

                    done();
                });
        });
    });

    describe('getDuration', function() {
        it('should return number in seconds', function() {
            var result,
                expectedResult = 40,
                linearCreative = new VastLinearCreative(mockVastResponse);

            helpers.getSecondsFromTimeString.withArgs(mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.Duration.nodeValue)
                                            .returns(expectedResult);

            result = linearCreative.getDuration();

            expect(result).to.equal(expectedResult);
        });
    });

    describe('getVideoClickTracking', function() {
        beforeEach(function(){

        });

        it('should return an array of click trackers', function() {
            var result,
                linearCreative = new VastLinearCreative(mockVastResponse);

            result = linearCreative.getClickTrackers();

            expect(result.length).to.equal(6);
            expect(result).to.contain("http://example.com/video-click1?d=[CACHEBUSTER]");
            expect(result).to.contain("http://example.com/video-click2?d=[CACHEBUSTER]");
            expect(result).to.contain("http://example.com/video-click3?d=[CACHEBUSTER]");
            expect(result).to.contain("http://example.com/video-click4?d=[CACHEBUSTER]");
            expect(result).to.contain("http://example.com/video-click5?d=[CACHEBUSTER]");
            expect(result).to.contain("http://example.com/video-click6?d=[CACHEBUSTER]");
        });
    });

    describe('Media Files', function() {
        beforeEach(function() {
            var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear;
            linearCreativeXml.MediaFiles.MediaFile.push({
                nodeValue: 'http://example.com/video.mp4'
            });
        });

        describe('getMediaFiles', function() {
            it('should return all MediaFile objects when no filter supplied', function() {
                var mediaFiles,
                    linearCreative = new VastLinearCreative(mockVastResponse);

                mediaFiles = linearCreative.getMediaFiles();

                expect(mediaFiles.length).to.equal(2);
                expect(mediaFiles[0].url).to.equal('videoUrl');
                expect(mediaFiles[1].url).to.equal('http://example.com/video.mp4');
            });

            it('should return all MediaFile objects when an empty filter is supplied', function() {
                var mediaFiles,
                    linearCreative = new VastLinearCreative(mockVastResponse),
                    filter = {};

                mediaFiles = linearCreative.getMediaFiles(filter);

                expect(mediaFiles.length).to.equal(2);
                expect(mediaFiles[0].url).to.equal('videoUrl');
                expect(mediaFiles[1].url).to.equal('http://example.com/video.mp4');
            });

            it('should return filtered array of MediaFile objects', function() {
                var mediaFiles,
                    linearCreative = new VastLinearCreative(mockVastResponse),
                    linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear,
                    filter = {type: 'type/mp4'};

                linearCreativeXml.MediaFiles.MediaFile.push({
                    nodeValue: 'http://example.com/expected.mp4',
                    '@type': 'type/mp4'
                });

                mediaFiles = linearCreative.getMediaFiles(filter);

                expect(mediaFiles.length).to.equal(1);
                expect(mediaFiles[0].url).to.equal('http://example.com/expected.mp4');
            });
        });

        describe('hasFlashVPAID', function() {
            it('should return false when no VPAID creative found', function() {
                var linearCreative = new VastLinearCreative(mockVastResponse);

                expect(linearCreative.hasFlashVPAID()).to.be.false;
            });

            it('should return true when a VPAID MediaFile found', function() {
                var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear;
                linearCreativeXml.MediaFiles.MediaFile.push({
                    nodeValue: 'http://example.com/vpaid.swf',
                    '@type': 'application/javascript',
                    '@apiFramework': 'VPAID'
                });

                var linearCreative = new VastLinearCreative(mockVastResponse);

                expect(linearCreative.hasFlashVPAID()).to.be.false;
            });

            it('should return true when a VPAID MediaFile found', function() {
                var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear;
                linearCreativeXml.MediaFiles.MediaFile.push({
                    nodeValue: 'http://example.com/vpaid.swf',
                    '@type': 'application/x-shockwave-flash',
                    '@apiFramework': 'VPAID'
                });

                var linearCreative = new VastLinearCreative(mockVastResponse);

                expect(linearCreative.hasFlashVPAID()).to.be.true;
            });
        });

        describe('hasJavascriptVPAID', function() {
            it('should return false when no VPAID creative found', function() {
                var linearCreative = new VastLinearCreative(mockVastResponse);

                expect(linearCreative.hasJavascriptVPAID()).to.be.false;
            });

            it('should return true when a VPAID MediaFile found', function() {
                var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear;
                linearCreativeXml.MediaFiles.MediaFile.push({
                    nodeValue: 'http://example.com/vpaid.swf',
                    '@type': 'application/x-shockwave-flash',
                    '@apiFramework': 'VPAID'
                });

                var linearCreative = new VastLinearCreative(mockVastResponse);

                expect(linearCreative.hasJavascriptVPAID()).to.be.false;
            });

            it('should return true when a VPAID MediaFile found', function() {
                var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear;
                linearCreativeXml.MediaFiles.MediaFile.push({
                    nodeValue: 'http://example.com/vpaid.swf',
                    '@type': 'application/javascript',
                    '@apiFramework': 'VPAID'
                });

                var linearCreative = new VastLinearCreative(mockVastResponse);

                expect(linearCreative.hasJavascriptVPAID()).to.be.true;
            });
        });

        describe('hasMp4', function() {
            it('should return false when no mp4 file MediaFile found', function() {
                var linearCreative = new VastLinearCreative(mockVastResponse);

                expect(linearCreative.hasMp4()).to.be.false;
            });

            it('should return false when a flv file type MediaFile found', function() {
                var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear;
                linearCreativeXml.MediaFiles.MediaFile.push({
                    nodeValue: 'http://example.com/vpaid.flv',
                    '@type': 'video/x-flv'
                });

                var linearCreative = new VastLinearCreative(mockVastResponse);

                expect(linearCreative.hasMp4()).to.be.false;
            });

            it('should return true when a mp4 file type MediaFile found', function() {
                var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear;
                linearCreativeXml.MediaFiles.MediaFile.push({
                    nodeValue: 'http://example.com/vpaid.mp4',
                    '@type': 'video/mp4'
                });

                var linearCreative = new VastLinearCreative(mockVastResponse);

                expect(linearCreative.hasMp4()).to.be.true;
            });
        });
    });
});
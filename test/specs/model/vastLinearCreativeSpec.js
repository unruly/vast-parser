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
                                    "nodeValue": "http://example.com/native/vast/inlines/test_vast_inline_with-linear-ad.xml"
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
                                            },
                                            TrackingEvents: {
                                                Tracking: [
                                                    {
                                                        "@event": "midpoint",
                                                        nodeValue: "https://example.com/blank.gif?t=midpoint1"
                                                    },
                                                    {
                                                        "@event": "complete",
                                                        nodeValue: "//example.com/blank.gif?t=complete"
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
                                    "nodeValue": "http://localhost/test/resources/vast/inlines/test_vast_inline_with-linear-ad.xml"
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
                                            },
                                            TrackingEvents: {
                                                Tracking: [
                                                    {
                                                        "@event": "midpoint",
                                                        nodeValue: "http://example.com/blank.gif?t=midpoint2"
                                                    },
                                                    {
                                                        "@event": "midpoint",
                                                        nodeValue: "//example.com/blank.gif?t=midpoint3"
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
                                        },
                                        "AdParameters": {
                                            "nodeValue": "ad parameter"
                                        },
                                        TrackingEvents: {
                                            Tracking: [
                                                {
                                                    "@event": "midpoint",
                                                    nodeValue: "//example.com/blank.gif?t=midpoint4"
                                                },
                                                {
                                                    "@event": "withInvalidURL",
                                                    nodeValue: "not!a!valid!url"
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

    function overrideMockInlineAndWrapperClickTracking(inlineClickTrackers, wrapperClickTrackers) {
        var inlineTracking,
            wrapperTracking;

        mockVastResponse.inline = {
            "VAST": {
                "Ad": {
                    "InLine": {
                        "Creatives": {
                            "Creative": {
                                "Linear": {
                                    "VideoClicks": {
                                        "ClickTracking": []
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        mockVastResponse.wrappers = [{
            "VAST": {
                "Ad": {
                    "Wrapper": {
                        "Creatives": {
                            "Creative": {
                                "Linear": {
                                    "VideoClicks": {
                                        "ClickTracking": []
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }];

        inlineTracking = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative.Linear.VideoClicks.ClickTracking;

        inlineClickTrackers.forEach(function(clickTracker) {
            inlineTracking.push(clickTracker);
        });

        wrapperTracking = mockVastResponse.wrappers[0].VAST.Ad.Wrapper.Creatives.Creative.Linear.VideoClicks.ClickTracking;

        wrapperClickTrackers.forEach(function(clickTracker) {
            wrapperTracking.push(clickTracker);
        });
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

        it('should return an array of all click trackers if no parameter passed', function() {
            var result,
                linearCreative = new VastLinearCreative(mockVastResponse);

            result = linearCreative.getClickTrackers();

            expect(result.length).to.equal(6);
            expect(result).to.contain('//example.com/video-click1?d=[CACHEBUSTER]');
            expect(result).to.contain('//example.com/video-click2?d=[CACHEBUSTER]');
            expect(result).to.contain('//example.com/video-click3?d=[CACHEBUSTER]');
            expect(result).to.contain('//example.com/video-click4?d=[CACHEBUSTER]');
            expect(result).to.contain('//example.com/video-click5?d=[CACHEBUSTER]');
            expect(result).to.contain('//example.com/video-click6?d=[CACHEBUSTER]');
        });

        it('should return an array of click trackers of the specified id and those with no id', function() {
            var result,
                linearCreative;

            overrideMockInlineAndWrapperClickTracking(
                [{
                    "nodeValue":  "https://example.com/some_click?d=[CACHEBUSTER]",
                    "@id": "some_click"
                },
                {
                    "nodeValue":  "https://example.com/post_video_click?d=[CACHEBUSTER]",
                    "@id": "post_video_click"
                },
                {
                    "nodeValue":  "https://example.com/post_video_click2?d=[CACHEBUSTER]"
                }],
                [{
                    "nodeValue": "https://example.com/wrapper/some_click?d=[CACHEBUSTER]",
                    "@id": "some_click"
                },
                {
                    "nodeValue": "https://example.com/wrapper/post_video_click?d=[CACHEBUSTER]",
                    "@id": "post_video_click"
                }]
            );

            linearCreative = new VastLinearCreative(mockVastResponse);

            result = linearCreative.getClickTrackers('post_video_click');

            expect(result.length).to.equal(3);
            expect(result).to.contain('https://example.com/post_video_click?d=[CACHEBUSTER]');
            expect(result).to.contain('https://example.com/post_video_click2?d=[CACHEBUSTER]');
            expect(result).to.contain('https://example.com/wrapper/post_video_click?d=[CACHEBUSTER]');
        });
        
        it('should discard invalid URLs', function() {
            var result,
                linearCreative;

            overrideMockInlineAndWrapperClickTracking(
                [{
                    "nodeValue": "an_invalid_url"
                }],
                [{
                    "nodeValue": "http://example.com/valid"
                },
                {
                    "nodeValue": "abc:invalid:url"
                }]
            );

            linearCreative = new VastLinearCreative(mockVastResponse);
            result = linearCreative.getClickTrackers();

            expect(result.length).to.equal(1);
            expect(result).to.contain('//example.com/valid');
        });
        

        it('should keep https:// url protocols', function() {
            var result,
                linearCreative;

            overrideMockInlineAndWrapperClickTracking(
                [{
                    "nodeValue":  "https://example.com/video-click5?d=[CACHEBUSTER]"
                }],
                [{
                    "nodeValue": "https://example.com/wrapper/video-click5?d=[CACHEBUSTER]"
                }]
            );

            linearCreative = new VastLinearCreative(mockVastResponse);
            result = linearCreative.getClickTrackers();

            expect(result.length).to.equal(2);
            expect(result).to.contain('https://example.com/video-click5?d=[CACHEBUSTER]');
            expect(result).to.contain('https://example.com/wrapper/video-click5?d=[CACHEBUSTER]');
        });

        it('should remove http:// hardcoded url protocols', function() {
            var result,
                linearCreative;

            overrideMockInlineAndWrapperClickTracking(
                [{
                    "nodeValue":  "http://example.com/video-click5?d=[CACHEBUSTER]"
                }],
                [{
                    "nodeValue": "http://example.com/wrapper/video-click5?d=[CACHEBUSTER]"
                }]
            );

            linearCreative = new VastLinearCreative(mockVastResponse);
            result = linearCreative.getClickTrackers();

            expect(result.length).to.equal(2);
            expect(result).to.contain('//example.com/video-click5?d=[CACHEBUSTER]');
            expect(result).to.contain('//example.com/wrapper/video-click5?d=[CACHEBUSTER]');
        });

        it('should do nothing with protocols independent urls', function() {
            var result,
                linearCreative;

            overrideMockInlineAndWrapperClickTracking(
                [{
                    "nodeValue":  "//example.com/video-click5?d=[CACHEBUSTER]"
                }],
                [{
                    "nodeValue": "//example.com/wrapper/video-click5?d=[CACHEBUSTER]"
                }]
            );

            linearCreative = new VastLinearCreative(mockVastResponse);
            result = linearCreative.getClickTrackers();

            expect(result.length).to.equal(2);
            expect(result).to.contain('//example.com/video-click5?d=[CACHEBUSTER]');
            expect(result).to.contain('//example.com/wrapper/video-click5?d=[CACHEBUSTER]');
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
                    nodeValue: 'http://example.com/vpaid.js',
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


        describe('getFlashVPAIDMediaFiles', function() {
            it('should return empty array when no flash VPAID creatives found', function() {
                var mediaFiles,
                    linearCreative = new VastLinearCreative(mockVastResponse);

                mediaFiles = linearCreative.getFlashVPAIDMediaFiles();

                expect(mediaFiles).to.deep.equal([]);
            });

            it('should return array of VastMediaFile objects for flash VPAID MediaFiles found', function() {
                var mediaFiles,
                    linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear;
                    linearCreativeXml.MediaFiles.MediaFile.push({
                        nodeValue: 'http://example.com/vpaid.swf',
                        '@type': 'application/x-shockwave-flash',
                        '@apiFramework': 'VPAID'
                    });

                var linearCreative = new VastLinearCreative(mockVastResponse);

                mediaFiles = linearCreative.getFlashVPAIDMediaFiles();

                expect(mediaFiles.length).to.equal(1);
                expect(mediaFiles[0].url).to.equal('http://example.com/vpaid.swf');
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
                    nodeValue: 'http://example.com/vpaid.js',
                    '@type': 'application/javascript',
                    '@apiFramework': 'VPAID'
                });

                var linearCreative = new VastLinearCreative(mockVastResponse);

                expect(linearCreative.hasJavascriptVPAID()).to.be.true;
            });
        });

        describe('getJavascriptVPAIDMediaFiles', function() {
            it('should return empty array when no javascript VPAID creatives found', function() {
                var mediaFiles,
                    linearCreative = new VastLinearCreative(mockVastResponse);

                mediaFiles = linearCreative.getJavascriptVPAIDMediaFiles();

                expect(mediaFiles).to.deep.equal([]);
            });

            it('should return array of VastMediaFile objects for javascript VPAID MediaFiles found', function() {
                var mediaFiles,
                    linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear;
                linearCreativeXml.MediaFiles.MediaFile.push({
                    nodeValue: 'http://example.com/vpaid.js',
                    '@type': 'application/javascript',
                    '@apiFramework': 'VPAID'
                });

                var linearCreative = new VastLinearCreative(mockVastResponse);

                mediaFiles = linearCreative.getJavascriptVPAIDMediaFiles();

                expect(mediaFiles.length).to.equal(1);
                expect(mediaFiles[0].url).to.equal('http://example.com/vpaid.js');
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

            it('should return false when a streaming mp4 file type MediaFile found', function() {
                var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear;
                linearCreativeXml.MediaFiles.MediaFile.push({
                    nodeValue: 'http://example.com/vpaid.mp4',
                    '@type': 'video/mp4',
                    '@delivery': 'streaming'
                });

                var linearCreative = new VastLinearCreative(mockVastResponse);

                expect(linearCreative.hasMp4()).to.be.false;
            });

            it('should return true when a progressive mp4 file type MediaFile found', function() {
                var linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear;
                linearCreativeXml.MediaFiles.MediaFile.push({
                    nodeValue: 'http://example.com/vpaid.mp4',
                    '@type': 'video/mp4',
                    '@delivery': 'progressive'
                });

                var linearCreative = new VastLinearCreative(mockVastResponse);

                expect(linearCreative.hasMp4()).to.be.true;
            });
        });

        describe('getMp4MediaFiles', function() {
            it('should return empty array when no mp4 creatives found', function() {
                var mediaFiles,
                    linearCreative = new VastLinearCreative(mockVastResponse);

                mediaFiles = linearCreative.getMp4MediaFiles();

                expect(mediaFiles).to.deep.equal([]);
            });

            it('should return empty array when only streaming mp4 MediaFiles found', function() {
                var mediaFiles,
                    linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear;
                linearCreativeXml.MediaFiles.MediaFile.push({
                    nodeValue: 'http://example.com/vpaid.mp4',
                    '@type': 'video/mp4',
                    '@delivery': 'streaming'
                });

                var linearCreative = new VastLinearCreative(mockVastResponse);

                mediaFiles = linearCreative.getMp4MediaFiles();

                expect(mediaFiles).to.deep.equal([]);
            });

            it('should return array of VastMediaFile objects for progressive mp4 MediaFiles found', function() {
                var mediaFiles,
                    linearCreativeXml = mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear;
                linearCreativeXml.MediaFiles.MediaFile.push({
                    nodeValue: 'http://example.com/vpaid.mp4',
                    '@type': 'video/mp4',
                    '@delivery': 'progressive'
                });

                var linearCreative = new VastLinearCreative(mockVastResponse);

                mediaFiles = linearCreative.getMp4MediaFiles();

                expect(mediaFiles.length).to.equal(1);
                expect(mediaFiles[0].url).to.equal('http://example.com/vpaid.mp4');
            });
        });

        describe('getClickThrough', function() {
            it('should return undefined if VideoClicks is not present', function() {
                mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks = undefined;

                var linearCreative = new VastLinearCreative(mockVastResponse),
                    clickThrough;

                clickThrough = linearCreative.getClickThrough();

                expect(clickThrough).to.be.undefined;
            });

            it('should return undefined if ClickThrough is not present', function() {
                mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickThrough = undefined;

                var linearCreative = new VastLinearCreative(mockVastResponse),
                    clickThrough;

                clickThrough = linearCreative.getClickThrough();

                expect(clickThrough).to.be.undefined;
            });

            it('should return the url if ClickThrough is present', function() {
                var linearCreative = new VastLinearCreative(mockVastResponse),
                    clickThrough;

                clickThrough = linearCreative.getClickThrough();

                expect(clickThrough).to.equal('http://example.com/clickthrough');
            });
        });

        describe('getAdParameters', function() {
            it('should return undefined when no AdParameters', function() {
               mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.AdParameters = undefined;
               var linearCreative = new VastLinearCreative(mockVastResponse),
                   adParameters;

               adParameters = linearCreative.getAdParameters();

               expect(adParameters).to.be.undefined;
            });

            it('should return the ad parameters when they are present', function() {
               var linearCreative = new VastLinearCreative(mockVastResponse),
                   adParameters;

               adParameters = linearCreative.getAdParameters();

               expect(adParameters).to.equal('ad parameter');
            });

            it('should return the original ad parameters nodeValue when attribute xmlEncoded is false', function() {
                mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.AdParameters = {
                    nodeValue: '{&quot;test&quot;:true,&quot;url&quot;:&quot;http://example.com?a=1&amp;b=2&quot;,&apos;string&apos;:&apos;&lt;&gt;&apos;}',
                    '@xmlEncoded': 'false'
                };

                var linearCreative = new VastLinearCreative(mockVastResponse),
                    adParameters;

                adParameters = linearCreative.getAdParameters();

                expect(adParameters).to.equal('{&quot;test&quot;:true,&quot;url&quot;:&quot;http://example.com?a=1&amp;b=2&quot;,&apos;string&apos;:&apos;&lt;&gt;&apos;}');
            });

            it('should return the decoded ad parameters when attribute xmlEncoded is true and node value is a string', function() {
                mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.AdParameters = {
                    nodeValue: '{&quot;test&quot;:true,&quot;url&quot;:&quot;http://example.com?a=1&amp;b=2&quot;,&apos;string&apos;:&apos;&lt;&gt;&apos;}',
                    '@xmlEncoded': 'true'
                };

                var linearCreative = new VastLinearCreative(mockVastResponse),
                    adParameters;

                adParameters = linearCreative.getAdParameters();

                expect(adParameters).to.equal('{"test":true,"url":"http://example.com?a=1&b=2",\'string\':\'<>\'}');
            });

            it('should return the original ad parameters nodeValue when attribute xmlEncoded true but node value is not a string', function() {
                mockVastResponse.inline.VAST.Ad.InLine.Creatives.Creative[1].Linear.AdParameters = {
                    nodeValue: 0,
                    '@xmlEncoded': 'true'
                };

                var linearCreative = new VastLinearCreative(mockVastResponse),
                    adParameters;

                adParameters = linearCreative.getAdParameters();

                expect(adParameters).to.equal(0);
            });
        });

        describe('getTrackingEvents', function() {
            it('should return all tracking events for event midpoint', function() {
                var linearCreative = new VastLinearCreative(mockVastResponse),
                    trackingEvents;

                trackingEvents = linearCreative.getTrackingEvents('midpoint');

                expect(trackingEvents.length).to.be.equal(4);
                expect(trackingEvents[0]).to.equal('//example.com/blank.gif?t=midpoint4');
                expect(trackingEvents[1]).to.equal('https://example.com/blank.gif?t=midpoint1');
                expect(trackingEvents[2]).to.equal('//example.com/blank.gif?t=midpoint2');
                expect(trackingEvents[3]).to.equal('//example.com/blank.gif?t=midpoint3');
            });

            it('should return all tracking events for event complete', function() {
                var linearCreative = new VastLinearCreative(mockVastResponse),
                    trackingEvents;

                trackingEvents = linearCreative.getTrackingEvents('complete');

                expect(trackingEvents.length).to.be.equal(1);
                expect(trackingEvents[0]).to.equal('//example.com/blank.gif?t=complete')

            });

            it('should return empty array for events that can\'t be found', function() {
                var linearCreative = new VastLinearCreative(mockVastResponse),
                    trackingEvents;

                trackingEvents = linearCreative.getTrackingEvents('something');

                expect(trackingEvents.length).to.be.equal(0);
            });

            it('should discard events with invalid URLs', function() {
                var linearCreative = new VastLinearCreative(mockVastResponse),
                    trackingEvents;

                trackingEvents = linearCreative.getTrackingEvents('withInvalidURL');

                expect(trackingEvents.length).to.be.equal(0);
            });
        });
    });
});

describe('VAST Parser', function(){

    var vastParser,
        targetingUUID = 'with-non-linear-ad-only';

    function loadTestXML(filename, test) {
        requirejs(['text!../../test/resources/vast/' + filename], function(xmlString) {
            var parser = new DOMParser(),
                xmlDocument = parser.parseFromString(xmlString, "application/xml");

            if (typeof xmlDocument.evaluate !== 'function') {
                xmlDocument = new ActiveXObject('msxml2.DOMDocument');
                xmlDocument.loadXML(xmlString);
                xmlDocument.setProperty("SelectionLanguage", "XPath");
            }

            test(xmlDocument);
        });
    }

    before(function(done) {
        requirejs(['Squire'], function(Squire) {
            var injector;

            injector = new Squire()
                .require(['vast-parser'], function(vastParserModule) {
                    vastParser = vastParserModule;
                    done();
                });

        });
    });

    describe('parses VAST Inline', function() {
        var inlineURL = 'inlines/test_vast_inline_123.xml';

        it('parses AdTitle from XML document', function(done) {
            loadTestXML(inlineURL, function(vastDocument) {

                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.InLine.AdTitle.nodeValue).to.equal('Example Title');

                done();
            });
        });

        it('parses Description from XML document', function(done) {
            loadTestXML(inlineURL, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.InLine.Description.nodeValue).to.equal('Example Description');

                done();
            });
        });

        it('parses StaticResource (thumbnail) from XML document', function(done) {
            loadTestXML(inlineURL, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.InLine.Creatives.Creative.NonLinearAds.NonLinear.StaticResource.nodeValue).to.equal('http://example.com/thumb.jpg');

                done();
            });
        });

        it('parses NonLinearClickThrough from XML document', function(done) {
            loadTestXML(inlineURL, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.InLine.Creatives.Creative.NonLinearAds.NonLinear.NonLinearClickThrough.nodeValue).to.equal('http://example.com/clickthrough.html');

                done();
            });
        });

        it('linear object should not be defined', function(done) {
            loadTestXML(inlineURL, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.InLine.Creatives.Creative.Linear).to.be.undefined;

                done();
            });
        });

        it('parses clickthrough url from linear creative', function(done) {
            var inlineWithClickThroughUrl = 'inlines/test_vast_inline_with-linear-and-non-linear-ads.xml';
            loadTestXML(inlineWithClickThroughUrl, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickThrough.nodeValue).to.equal('http://example.com/linear-video-clickthrough');

                done();
            });
        });

        it('parses click tracking pixel from VAST inline', function(done) {
            var inlineWithClickThroughUrl = 'inlines/test_vast_inline_with-linear-and-non-linear-ads.xml';

            loadTestXML(inlineWithClickThroughUrl, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickTracking.length).to.equal(2);

                expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickTracking[0]['@id']).to.equal('video_click');
                expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickTracking[0].nodeValue).to.equal('http://example.com/inline/linear-video-click');

                expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickTracking[1]['@id']).to.equal('post_video_click');
                expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.VideoClicks.ClickTracking[1].nodeValue).to.equal('http://example.com/inline/linear-post-video-click');

                done();
            });
        });

        describe('with Multiple Creatives', function() {
            var inlineURL = 'inlines/test_vast_inline_with-linear-ad.xml';

            it('parses MediaFile from XML Document', function(done) {
                loadTestXML(inlineURL, function(vastDocument) {
                    var obj = vastParser.parse(vastDocument);
                    var expectedUrl = 'http://example.com/video.mp4';

                    expect(obj.VAST.Ad.InLine.Creatives.Creative[1].Linear.MediaFiles.MediaFile.nodeValue).to.equal(expectedUrl);
                    done();
                });
            });

        });
    });

    describe('parses VAST Wrapper', function() {
        var wrapperURL = 'wrappers/vast_wrapper_'+targetingUUID+'.xml';

        it('parses Impressions from XML document', function(done) {
            loadTestXML(wrapperURL, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.Wrapper.Impression[0].nodeValue).to.equal('http://example.com/imp?d=[CACHEBUSTER]');
                expect(obj.VAST.Ad.Wrapper.Impression[1].nodeValue).to.equal('http://example.com/another-imp?d=[CACHEBUSTER]');

                done();
            });
        });

        it('parses VASTAdTagURI from XML document', function(done) {
            loadTestXML(wrapperURL, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue).to.equal('http://localhost/test/resources/vast/inlines/test_vast_inline_123.xml');

                done();
            });
        });

        it('parses Error from XML document', function(done) {
            loadTestXML(wrapperURL, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.Wrapper.Error.nodeValue).to.equal('http://example.com/error/ERRORCODE');

                done();
            });
        });

        it('parses NonLinearClickTracking from XML document', function(done) {
            loadTestXML(wrapperURL, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.Wrapper.Creatives.Creative.NonLinearAds.NonLinear.NonLinearClickTracking.nodeValue).to.equal('http://example.com/click');

                done();
            });
        });

        it('parses start tracking pixel from VAST Wrapper containing linear and non-linear ads', function(done) {
            var wrapperWithLinearAndNonLinearTracking = 'wrappers/vast_wrapper_with-linear-and-non-linear-ads.xml';

            loadTestXML(wrapperWithLinearAndNonLinearTracking, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.TrackingEvents.Tracking[0]['@event']).to.equal('start');
                expect(obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.TrackingEvents.Tracking[0].nodeValue).to.equal('http://example.com/start?d=[CACHEBUSTER]');

                expect(obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.TrackingEvents.Tracking[1]['@event']).to.equal('start');
                expect(obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.TrackingEvents.Tracking[1].nodeValue).to.equal('http://example.com/start2?d=[CACHEBUSTER]');

                done();
            });
        });

        it('parses start tracking pixel from VAST Wrapper containing a linear ad only', function(done) {
            var wrapperWithLinearTracking = 'wrappers/vast_wrapper_with-linear-ad-only.xml';

            loadTestXML(wrapperWithLinearTracking, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.Wrapper.Creatives.Creative.Linear.TrackingEvents.Tracking['@event']).to.equal('start');
                expect(obj.VAST.Ad.Wrapper.Creatives.Creative.Linear.TrackingEvents.Tracking.nodeValue).to.equal('http://example.com/start');

                done();
            });
        });

        it('parses click tracking pixel from VAST Wrapper containing linear ads with no ids', function(done) {
            var wrapperWithClickTrackersWithNoIds = 'wrappers/vast_wrapper_with-click-track-with-no-ids.xml';

            loadTestXML(wrapperWithClickTrackersWithNoIds, function(vastDocument) {
                var obj = vastParser.parse(vastDocument),
                    clickTracking = obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.VideoClicks.ClickTracking;

                expect(clickTracking.length).to.equal(2);
                expect(clickTracking[0].nodeValue).to.equal('http://example.com/linear-click');
                expect(clickTracking[1].nodeValue).to.equal('http://example.com/linear-click2');

                done();
            });
        });

        it('parses click tracking pixel from VAST Wrapper containing linear and non-linear ads', function(done) {
            var wrapperWithLinearAndNonLinearTracking = 'wrappers/vast_wrapper_with-linear-and-non-linear-ads.xml';

            loadTestXML(wrapperWithLinearAndNonLinearTracking, function(vastDocument) {
                var obj = vastParser.parse(vastDocument),
                    clickTracking = obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.VideoClicks.ClickTracking;

                expect(clickTracking.length).to.equal(5);

                expect(clickTracking[0]['@id']).to.equal('video_click');
                expect(clickTracking[0].nodeValue).to.equal('http://example.com/linear-video-click');

                expect(clickTracking[1]['@id']).to.equal('video_click');
                expect(clickTracking[1].nodeValue).to.equal('http://example.com/linear-video-click2');

                expect(clickTracking[2]['@id']).to.equal('video_click');
                expect(clickTracking[2].nodeValue).to.equal('http://example.com/linear-video-click3');

                expect(clickTracking[3]['@id']).to.equal('post_video_click');
                expect(clickTracking[3].nodeValue).to.equal('http://example.com/linear-post-video-click');

                expect(clickTracking[4]['@id']).to.equal('post_video_click');
                expect(clickTracking[4].nodeValue).to.equal('http://example.com/linear-post-video-click2');

                done();
            });
        });

        it('parses click tracking pixel from VAST Wrapper containing a linear ad only', function(done) {
            var wrapperWithLinearTracking = 'wrappers/vast_wrapper_with-linear-ad-only.xml';

            loadTestXML(wrapperWithLinearTracking, function(vastDocument) {
                var obj = vastParser.parse(vastDocument),
                    clickTracking = obj.VAST.Ad.Wrapper.Creatives.Creative.Linear.VideoClicks.ClickTracking;

                expect(clickTracking.length).to.equal(2);

                expect(clickTracking[0]['@id']).to.equal('video_click');
                expect(clickTracking[0].nodeValue).to.equal('http://example.com/linear-video-click');

                expect(clickTracking[1]['@id']).to.equal('post_video_click');
                expect(clickTracking[1].nodeValue).to.equal('http://example.com/linear-post-video-click');

                done();
            });
        });

        it('doesnt break when no click tracking provided', function(done) {
            var wrapperWithLinearTracking = 'wrappers/vast_wrapper_with-no-clicks.xml';

            loadTestXML(wrapperWithLinearTracking, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.Wrapper.Creatives.Creative[1].Linear.VideoClicks).to.be.undefined;

                done();
            });
        });

        it('parses custom array from VAST Wrapper containing custom extensions', function(done) {
            var wrapperWithCustomElement = 'wrappers/vast_wrapper_with-custom-element.xml';

            loadTestXML(wrapperWithCustomElement, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.Wrapper.Extensions.Extension.CustomArray.CustomElement.length).to.equal(2);
                expect(obj.VAST.Ad.Wrapper.Extensions.Extension.CustomArray.CustomElement[0].nodeValue).to.equal('customData');
                expect(obj.VAST.Ad.Wrapper.Extensions.Extension.CustomArray.CustomElement[0]['@customId']).to.equal('stuff');

                expect(obj.VAST.Ad.Wrapper.Extensions.Extension.CustomArray.CustomElement[1].nodeValue).to.equal('moreCustomData');
                expect(obj.VAST.Ad.Wrapper.Extensions.Extension.CustomArray.CustomElement[1]['@customId']).to.equal('things');

                done();
            });
        });

        it('parses custom element from VAST Wrapper containing custom extensions', function(done) {
            var wrapperWithCustomElement = 'wrappers/vast_wrapper_with-custom-element.xml';

            loadTestXML(wrapperWithCustomElement, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad.Wrapper.Extensions.Extension.CustomElement.nodeValue).to.equal('customThing');

                done();
            });
        });
    });

    describe('parses VAST with errors', function() {

        it('parses empty VAST tag', function(done) {
            var errorUrl = 'wrappers/vast_wrapper_no-ads.xml';
            loadTestXML(errorUrl, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST).not.to.be.undefined;
                expect(obj.VAST.Ad).to.be.undefined;

                done();
            });
        });

        it('parses error tag', function(done) {
            var errorUrl = 'wrappers/vast_wrapper_no-ads-and-error-tag.xml';
            loadTestXML(errorUrl, function(vastDocument) {
                var obj = vastParser.parse(vastDocument);

                expect(obj.VAST.Ad).to.be.undefined;
                expect(obj.VAST.Error).to.be.defined;

                done();
            });
        });

    });
});

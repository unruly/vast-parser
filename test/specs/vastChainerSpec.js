describe('VAST Chainer', function(){
    var vastChainer,
        vastParser,
        jQuery,
        mockServer,
        mockWrapper,
        mockTwoWrapperWrapper,
        mockNoAds,
        mockInline,
        mockError,
        mockEs6PromiseShim,
        mockDeferred,
        mockPromise,
        targetingUUID = 'ABCDEF-1234',
        mockTwoWrapperString = '<TWO_WRAPPER_TEST></TWO_WRAPPER_TEST>',
        mockWrapperString = '<WRAPPER></WRAPPER>',
        mockInlineString = '<INLINE></INLINE>',
        mockNoAdsString = '<NOADS></NOADS>',
        firstWrapperUrl = 'http://example.com/targeting/' + targetingUUID + '?params=values',
        now = 100,
        wrapperConfig,
        mockClock,
        vastErrorCodes,
        VastError,
        VastResponse,
        mockHttpsWrapper,
        mockHttpWrapper,
        mockHttpsEndpoint,
        helpers;

    beforeEach(function(done) {
        requirejs(['Squire'], function(Squire) {
            var injector = new Squire();

            mockPromise = {};
            mockPromise.then = sinon.stub().returns(mockPromise);
            mockPromise.catch = sinon.stub().returns(mockPromise);

            mockDeferred = {
                reject: sinon.stub(),
                resolve: sinon.stub()
            };

            mockEs6PromiseShim = {
                Promise: function(callback) {
                    callback(mockDeferred.resolve, mockDeferred.reject);
                    return mockPromise;
                }
            };

            injector.store(['jquery', 'vast-parser', 'vastErrorCodes', 'vastError', 'model/vastResponse', 'util/helpers']);
            injector.mock('es6promise', mockEs6PromiseShim);
            injector.require(['vastChainer', 'mocks'], function(module, mocks) {
                vastChainer = module;

                jQuery = mocks.store.jquery;
                jQuery.support.cors = true;

                vastParser = mocks.store['vast-parser'];
                vastErrorCodes = mocks.store['vastErrorCodes'];
                VastError = mocks.store['vastError'];
                VastResponse = mocks.store['model/vastResponse'];
                helpers = mocks.store['util/helpers'];

                sinon.stub(helpers, 'convertProtocol', function(url) {
                    return url;
                });

                sinon.stub(VastResponse.prototype, 'addRawResponse');

                sinon.stub(vastParser, 'parse', function(document) {
                    if(document.childNodes[0].nodeName === 'NOADS') {
                        return mockNoAds;
                    } else if(document.childNodes[0].nodeName === 'INLINE') {
                        return mockInline;
                    } else if(document.childNodes[0].nodeName === 'ERROR') {
                        return mockError;
                    } else if(document.childNodes[0].nodeName === 'TWO_WRAPPER_TEST') {
                        return mockTwoWrapperWrapper;
                    } else if(document.childNodes[0].nodeName === 'HTTPS_WRAPPER') {
                        return mockHttpsWrapper;
                    } else {
                        return mockWrapper;
                    }
                });

                done();
            });
        });

        mockWrapper = {
            "VAST": {
                "Ad": {
                    "Wrapper": {
                        "VASTAdTagURI": {
                            "nodeValue": "inlineVASTUrl"
                        }
                    }
                }
            }
        };

        mockTwoWrapperWrapper = {
            "VAST": {
                "Ad": {
                    "Wrapper": {
                        "VASTAdTagURI": {
                            "nodeValue": firstWrapperUrl
                        }
                    }
                }
            }
        };

        mockHttpsEndpoint = 'https://example.com';

        mockHttpsWrapper = {
            "VAST": {
                "Ad": {
                    "Wrapper": {
                        "VASTAdTagURI": {
                            "nodeValue": mockHttpsEndpoint
                        }
                    }
                }
            }
        };

        mockHttpWrapper = {
            "VAST": {
                "Ad": {
                    "Wrapper": {
                        "VASTAdTagURI": {
                            "nodeValue": 'http://example.com'
                        }
                    }
                }
            }
        };

        mockInline = {
            VAST: {
                Ad: {
                    InLine: {

                    }
                }
            }
        };

        mockError = {
            VAST: {
                Error: {}
            }
        };

        mockNoAds = {
            VAST : {}
        };

        wrapperConfig = {
            url: firstWrapperUrl
        };

        mockServer = sinon.fakeServer.create();
    });

    beforeEach(function() {
        mockClock = sinon.useFakeTimers(now);
    });

    afterEach(function () {
        mockServer.restore();
        mockClock.restore();
    });

    function vastError(error, message) {
        return sinon.match(function (value) {
            return value instanceof VastError &&
                value.code === error.code &&
                value.message.indexOf(message || error.message) >= 0;
        }, 'instance of VastError, matching code property and a substring of the message property');
    }

    function hasVastResponseProperty() {
        return sinon.match(function (value) {
            return value.vastResponse instanceof VastResponse;
        }, 'instance of VastResponse');
    }


    describe('getVastChain', function(){

        it('rejects promise when VAST tag request times out in 10 seconds', function() {
            vastChainer.getVastChain('http://non.existent.endpoint');

            mockClock.tick(9999);

            expect(mockDeferred.reject).to.not.have.been.called;

            mockClock.tick(1);

            expect(mockDeferred.reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.WRAPPER_URI_TIMEOUT, "VAST Request Failed (timeout 0)"));
            expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty());
        });

        it('rejects promise when VAST tag request fails', function(){
            mockServer.respondWith([404, { }, "Not Found"]);

            vastChainer.getVastChain('http://non.existent.endpoint');

            mockServer.respond();

            expect(mockDeferred.reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.WRAPPER_URI_TIMEOUT, "VAST Request Failed (error 404)"));
            expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty());
        });

        it('rejects promise when VAST tag is not valid XML', function(){
            mockServer.respondWith('GET', firstWrapperUrl, [200, {}, 'This is not XML']);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(mockDeferred.reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.XML_PARSE_ERROR, "VAST Request Failed (parsererror 200)"));
            expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty());
        });

        it('rejects promise includes VAST Request URL and HTTP errorThrown message on error message', function(){
            mockServer.respondWith('GET', firstWrapperUrl, [200, {}, 'This is not XML']);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(mockDeferred.reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.XML_PARSE_ERROR, "VAST Request Failed (parsererror 200) with message [Error: Invalid XML: This is not XML] for " + firstWrapperUrl));
            expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty());
        });

        it('rejects promise when response is empty', function(){

            mockServer.respondWith('GET', firstWrapperUrl, [200, {}, '']);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(mockDeferred.reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.XML_PARSE_ERROR));
            expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty());
        });

        it('rejects promise when VAST tag is empty', function() {
            mockServer.respondWith('GET', firstWrapperUrl, [200, {}, mockNoAdsString]);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(mockDeferred.reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.NO_ADS, 'VAST request returned no ads'));
            expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty());
        });

        it('rejects promise when VAST response has Error tag', function(){
            mockNoAds.VAST.Error = true;

            mockServer.respondWith('GET', firstWrapperUrl, [200, {}, mockNoAdsString]);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(mockDeferred.reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.NO_ADS, 'VAST request returned no ads and contains error tag'));
            expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty());
        });

        it('parses response when VAST tag request is successful', function(){
            mockServer.respondWith([200, {}, mockInlineString]);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(vastParser.parse).to.have.been.called;
            expect(mockDeferred.reject).to.not.have.been.called;
        });

        it('requests inline VAST if parsed VAST tag is a wrapper', function(){
            mockServer.respondWith('GET', firstWrapperUrl, [200, {}, mockWrapperString]);

            sinon.spy(jQuery, 'ajax');

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(jQuery.ajax.calledTwice).to.equal(true);

            var inlineRequest = jQuery.ajax.secondCall;
            expect(inlineRequest.args[0].url).to.equal('inlineVASTUrl');

            jQuery.ajax.restore();
        });

        it('should set headers from vastConfig', function() {
            mockServer.respondWith('GET', firstWrapperUrl, [200, {}, mockWrapperString]);

            wrapperConfig.headers = {
                'X-A-Header': 'a value'
            };

            sinon.spy(jQuery, 'ajax');

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(jQuery.ajax.calledTwice).to.be.true;
            expect(jQuery.ajax.firstCall.args[0].headers).to.deep.equal(wrapperConfig.headers);
            expect(jQuery.ajax.secondCall.args[0].headers).to.deep.equal({});

            jQuery.ajax.restore();
        });

        it('should only set xhrFields.withCredentials to true for requests that match CORS cookies', function() {
            wrapperConfig.url = 'http://targeting.acooladcompany.com/i/am/a/cool/targeting/server?abc=123';

            mockServer.respondWith('GET', wrapperConfig.url, [200, {}, mockWrapperString]);

            sinon.spy(jQuery, 'ajax');

            wrapperConfig.corsCookieDomains = ['targeting.acooladcompany.com'];
            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(jQuery.ajax.calledTwice).to.equal(true);

            expect(jQuery.ajax.firstCall.args[0].xhrFields.withCredentials).to.be.true;

            var inlineRequest = jQuery.ajax.secondCall;
            expect(inlineRequest.args[0].url).to.equal('inlineVASTUrl');
            expect(inlineRequest.args[0].xhrFields).to.not.be.defined;

            jQuery.ajax.restore();
        });

        it('should set xhrFields.withCredentials to true for multiple requests that match CORS cookies', function() {
            wrapperConfig.url = 'http://targeting.acooladcompany.com/i/am/a/cool/targeting/server?abc=123';
            mockWrapper.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue = 'http://second.com/?hey=there%20buddy';

            mockServer.respondWith('GET', wrapperConfig.url, [200, {}, mockWrapperString]);

            sinon.spy(jQuery, 'ajax');

            wrapperConfig.corsCookieDomains = [
                'targeting.acooladcompany.com',
                'second.com'
            ];
            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(jQuery.ajax.calledTwice).to.equal(true);

            expect(jQuery.ajax.firstCall.args[0].xhrFields.withCredentials).to.be.true;
            expect(jQuery.ajax.secondCall.args[0].xhrFields.withCredentials).to.be.true;

            jQuery.ajax.restore();
        });

        it('rejects promise when inline VAST request from parsed VAST wrapper fails', function(){
            mockServer.respondWith('GET', firstWrapperUrl, [200, {}, mockWrapperString]);
            mockServer.respondWith('GET', mockWrapper.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue, [404, {}, "Not Found"]);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();
            mockServer.respond();

            expect(mockDeferred.reject).to.have.been.calledWithMatch(vastError(vastErrorCodes.WRAPPER_URI_TIMEOUT, "VAST Request Failed (error 404)"));
            expect(mockDeferred.reject).to.have.been.calledWithMatch(hasVastResponseProperty());
        });


        it('fulfills promise with array of VAST tags', function() {
            mockServer.respondWith('GET', firstWrapperUrl, [200, {}, mockWrapperString]);
            mockServer.respondWith('GET', mockWrapper.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue, [200, {}, mockInlineString]);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();
            mockServer.respond();

            var inlineTags = mockDeferred.resolve.firstCall.args[0];

            var wrapperThen = mockPromise.then.firstCall.args[0];
            wrapperThen(inlineTags);

            var finalTags = mockDeferred.resolve.secondCall.args[0];

            expect(mockDeferred.resolve).to.have.been.calledTwice;
            expect(finalTags).to.be.an.instanceof(VastResponse);
            expect(finalTags.inline).to.equal(mockInline);
            expect(finalTags.wrappers[0]).to.equal(mockWrapper);
        });

        it('extracts 2 wrappers and an inline', function() {
            var twoWrapperRequestUrl = 'http://example.com/three_chain_vast.xml';

            wrapperConfig.url = twoWrapperRequestUrl;

            mockServer.respondWith('GET', twoWrapperRequestUrl, [200, {}, mockTwoWrapperString]);
            mockServer.respondWith('GET', firstWrapperUrl, [200, {}, mockWrapperString]);
            mockServer.respondWith('GET', mockWrapper.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue, [200, {}, mockInlineString]);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();
            mockServer.respond();
            mockServer.respond();

            var inlineTags = mockDeferred.resolve.firstCall.args[0];

            var wrapperThen = mockPromise.then.firstCall.args[0];
            wrapperThen(inlineTags);

            var secondWrapperTags = mockDeferred.resolve.secondCall.args[0];
            var twoWrapperThen = mockPromise.then.secondCall.args[0];
            twoWrapperThen(secondWrapperTags);

            var finalTags = mockDeferred.resolve.thirdCall.args[0];

            expect(mockDeferred.resolve).to.have.been.calledThrice;
            expect(finalTags).to.be.an.instanceof(VastResponse);
            expect(finalTags.inline).to.equal(mockInline);
            expect(finalTags.wrappers[0]).to.equal(mockTwoWrapperWrapper);
            expect(finalTags.wrappers[1]).to.equal(mockWrapper);
        });

        it('uses helper to convert protocol of url', function() {
            var httpUrl = 'http://example.com/vast.xml',
                mockVastString = '<HTTPS_WRAPPER></HTTPS_WRAPPER>',
                convertedUrl = 'https://example.com/vast.xml';

            sinon.spy(jQuery, 'ajax');
            helpers.convertProtocol.restore();
            sinon.stub(helpers, 'convertProtocol').returns(convertedUrl);

            wrapperConfig.url = httpUrl;

            mockServer.respondWith('GET', httpUrl, [200, {}, mockVastString]);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();
            var inlineRequest = jQuery.ajax.secondCall;

            expect(helpers.convertProtocol).to.have.been.calledOnce;
            expect(inlineRequest.args[0].url).to.equal(convertedUrl);
        });

        describe('with extra params', function() {
            beforeEach(function() {
                wrapperConfig.extraParams = 'unruly_cb=' + now;
            });

            it('should use question mark if the url does not have a query string', function() {
                var urlWithNoQueryParams = "http://example.com/" + targetingUUID;
                wrapperConfig.url = urlWithNoQueryParams;

                mockServer.respondWith('GET', urlWithNoQueryParams + '?' + wrapperConfig.extraParams, [200, {}, mockInlineString]);

                vastChainer.getVastChain(wrapperConfig);

                mockServer.respond();

                expect(vastParser.parse).to.have.been.called;
                expect(mockDeferred.resolve).to.have.been.called;
            });

            it('requests inline VAST if parsed VAST tag is a wrapper - without query string', function(){
                mockServer.respondWith('GET', firstWrapperUrl + '&' + wrapperConfig.extraParams, [200, {}, mockWrapperString]);

                sinon.spy(jQuery, 'ajax');

                vastChainer.getVastChain(wrapperConfig);

                mockServer.respond();

                expect(jQuery.ajax.calledTwice).to.equal(true);

                var inlineRequest = jQuery.ajax.secondCall;
                expect(inlineRequest.args[0].url).to.equal('inlineVASTUrl' + '?' + wrapperConfig.extraParams);

                jQuery.ajax.restore();
            });

            it('requests inline VAST if parsed VAST tag is a wrapper - with existing query string', function(){
                var expectedUrl = 'inlineVASTUrl?hey=there%20buddy';
                mockWrapper.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue = expectedUrl;

                mockServer.respondWith('GET', firstWrapperUrl + '&' + wrapperConfig.extraParams, [200, {}, mockWrapperString]);

                sinon.spy(jQuery, 'ajax');

                vastChainer.getVastChain(wrapperConfig);

                mockServer.respond();

                expect(jQuery.ajax.calledTwice).to.equal(true);

                var inlineRequest = jQuery.ajax.secondCall;
                expect(inlineRequest.args[0].url).to.equal(expectedUrl + '&' + wrapperConfig.extraParams);

                jQuery.ajax.restore();
            });
        });
    });

    describe('fire download events', function () {
        var beginVastDownload,
            finishVastDownload;

        beforeEach(function () {
            beginVastDownload = sinon.stub();
            finishVastDownload = sinon.stub();
            vastChainer.addEventListener('requestStart', beginVastDownload);
            vastChainer.addEventListener('requestEnd', finishVastDownload);
        });

        it('should fire request start and stop  on download of inline VAST', function(){
            mockServer.respondWith([200, {}, mockInlineString]);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(beginVastDownload).to.have.been.calledWithMatch({
                type: 'requestStart',
                requestNumber: 0,
                uri: firstWrapperUrl,
                vastResponse: {}
            });
            expect(finishVastDownload).to.have.been.calledWithMatch({
                type: 'requestEnd',
                requestNumber: 0,
                uri: firstWrapperUrl,
                vastResponse: {}
            });
        });

        it('should fire request start and stop on download of VAST Wrapper and Inline', function(){
            mockServer.respondWith('GET', firstWrapperUrl, [200, {}, mockWrapperString]);
            var inlineUrl = mockWrapper.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue;
            mockServer.respondWith('GET', inlineUrl, [200, {}, mockInlineString]);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();
            mockServer.respond();

            expect(beginVastDownload).to.have.been.calledWithMatch({
                type: 'requestStart',
                requestNumber: 0,
                uri: firstWrapperUrl,
                vastResponse: {}
            });
            expect(finishVastDownload).to.have.been.calledWithMatch({
                type: 'requestEnd',
                requestNumber: 0,
                uri: firstWrapperUrl,
                vastResponse: {}
            });


            expect(beginVastDownload).to.have.been.calledWithMatch({
                type: 'requestStart',
                requestNumber: 1,
                uri: inlineUrl,
                vastResponse: {}
            });
            expect(finishVastDownload).to.have.been.calledWithMatch({
                type: 'requestEnd',
                requestNumber: 1,
                uri: inlineUrl,
                vastResponse: {}
            });
        });

        it('should fire request start and stop on download of VAST with Error', function(){
            var vastErrorString = '<ERROR></ERROR>';
            mockServer.respondWith([200, {}, vastErrorString]);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(beginVastDownload).to.have.been.calledWithMatch({
                type: 'requestStart',
                requestNumber: 0,
                uri: firstWrapperUrl,
                vastResponse: {}
            });
            expect(finishVastDownload).to.have.been.calledWithMatch({
                type: 'requestEnd',
                requestNumber: 0,
                uri: firstWrapperUrl,
                vastResponse: {}
            });
        });

        it('should fire request start and stop on download of VAST without Ad', function(){
            mockServer.respondWith([200, {}, mockNoAdsString]);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(beginVastDownload).to.have.been.calledWithMatch({
                type: 'requestStart',
                requestNumber: 0,
                uri: firstWrapperUrl,
                vastResponse: {}
            });
            expect(finishVastDownload).to.have.been.calledWithMatch({
                type: 'requestEnd',
                requestNumber: 0,
                uri: firstWrapperUrl,
                vastResponse: {}
            });
        });

        it('should fire request start and stop when requested data is falsey', function(){
            mockServer.respondWith([200, {}, '']);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(beginVastDownload).to.have.been.calledWithMatch({
                type: 'requestStart',
                requestNumber: 0,
                uri: firstWrapperUrl,
                vastResponse: {}
            });
            expect(finishVastDownload).to.have.been.calledWithMatch({
                type: 'requestEnd',
                requestNumber: 0,
                uri: firstWrapperUrl,
                vastResponse: {}
            });
        });

        it('should fire request end when the request fails', function(){
            mockServer.respondWith([404, {}, '404 Error message']);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(finishVastDownload).to.have.been.calledWithMatch({
                type: 'requestEnd',
                requestNumber: 0,
                vastResponse: {},
                uri: firstWrapperUrl,
                error: { status: 404, statusText: "Not Found" }
            });
        });

        it('should still fire requestEnd when VAST tag is not valid XML', function(){
            mockServer.respondWith('GET', firstWrapperUrl, [200, {}, 'This is not XML']);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(finishVastDownload).to.have.been.calledWithMatch({
                type: 'requestEnd',
                requestNumber: 0,
                vastResponse: {},
                uri: firstWrapperUrl,
                error: { status: 200, statusText: "XML parsing error." }
            });
        });
    });

    describe('stores raw data on vast response', function () {

        it('should call addRawResponse after successful http request', function() {
            mockServer.respondWith([200, { "Content-Type": "application/json" }, mockInlineString]);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(VastResponse.prototype.addRawResponse).to.have.been.calledOnce;
            expect(VastResponse.prototype.addRawResponse).to.have.been.calledWith({
                requestNumber: 0,
                uri: firstWrapperUrl,
                response: mockInlineString,
                headers: 'Content-Type: application/json'
            });
        });

        it('should call addRawResponse after unsuccessful http request', function() {
            mockServer.respondWith([500, { "Content-Type": "application/json" }, '']);

            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();

            expect(VastResponse.prototype.addRawResponse).to.have.been.calledOnce;
            expect(VastResponse.prototype.addRawResponse).to.have.been.calledWith({
                requestNumber: 0,
                uri: firstWrapperUrl,
                response: '',
                headers: 'Content-Type: application/json'
            });
        });

        it('should call addRawResponse once per http response', function() {
            var inlineUrl = mockWrapper.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue;

            mockServer.respondWith('GET', firstWrapperUrl, [200, { "Content-Type": "application/json" }, mockWrapperString]);
            mockServer.respondWith('GET', inlineUrl, [400, { "Content-Type": "application/json" }, '']);
            vastChainer.getVastChain(wrapperConfig);

            mockServer.respond();
            mockServer.respond();

            expect(VastResponse.prototype.addRawResponse).to.have.been.calledWithMatch({
                requestNumber: 0,
                uri: firstWrapperUrl,
                response: mockWrapperString,
                headers: 'Content-Type: application/json'
            });

            expect(VastResponse.prototype.addRawResponse).to.have.been.calledWithMatch({
                requestNumber: 1,
                uri: inlineUrl,
                response: '',
                headers: 'Content-Type: application/json'
            });

            expect(VastResponse.prototype.addRawResponse).to.have.been.calledTwice;
        });
    });
});

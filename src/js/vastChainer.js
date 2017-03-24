/*global console:true*/

define(['jquery', './vast-parser', 'es6promise', './vastErrorCodes', './vastError', './model/vastResponse', './util/helpers'],
    function($, vastParser, promiseShim, vastErrorCodes, VastError, VastResponse, helpers) {

        var AJAX_TIMEOUT = 10000,
            vastRequestCounter = 0,
            dispatcher = $({});

        function addEventListener(eventName, handler) {
            dispatcher.on(eventName, handler);
        }

        function getDomainFromURL(url) {
            var a = window.document.createElement('a');
            a.href = url;
            return a.hostname;
        }

        function getVast(vastResponse, vastConfig, sendCookies) {

            var url = vastConfig.url,
                resolve,
                reject,
                promise = new promiseShim.Promise(function(_resolve, _reject) {
                    resolve = _resolve;
                    reject = _reject;
                }),
                currentRequestNumber = vastRequestCounter++,
                requestStartEvent,
                settings;

            if (vastConfig.extraParams && vastConfig.extraParams.length > 0) {
                if (vastConfig.url.indexOf('?') !== -1) {
                    url += '&' + vastConfig.extraParams;
                } else {
                    url += '?' + vastConfig.extraParams;
                }
            }

            settings = {
                url: url,
                headers: vastConfig.headers || {},
                dataType: 'xml'
            };

            if (sendCookies) {
                settings.xhrFields = {
                    withCredentials: true
                };
            } else {
                console.log('Retrying request without cookies:', url);
            }

            settings.timeout = AJAX_TIMEOUT;

            settings.success = function(data, status, jqXHR) {
                var vastTag,
                    childTagUri,
                    nextRequestConfig,
                    requestEndEvent;

                requestEndEvent = $.Event('requestEnd', {
                    requestNumber: currentRequestNumber,
                    uri: url,
                    vastResponse: vastResponse
                });

                vastResponse.addRawResponse({
                    requestNumber: currentRequestNumber,
                    uri: url,
                    response: jqXHR.responseText,
                    headers: jqXHR.getAllResponseHeaders().trim()
                });

                if (!data) {
                    dispatcher.trigger(requestEndEvent);
                    reject(new VastError(vastErrorCodes.XML_PARSE_ERROR.code, vastResponse));
                    return;
                }

                vastTag = vastParser.parse(data);

                if (vastTag.VAST.Error) {
                    dispatcher.trigger(requestEndEvent);
                    reject(new VastError(vastErrorCodes.NO_ADS.code, vastResponse, 'VAST request returned no ads and contains error tag'));
                    return;
                }

                if (!vastTag.VAST.Ad) {
                    dispatcher.trigger(requestEndEvent);
                    reject(new VastError(vastErrorCodes.NO_ADS.code, vastResponse, 'VAST request returned no ads'));
                    return;
                }

                if (vastTag.VAST && vastTag.VAST.Ad && vastTag.VAST.Ad.InLine) {
                    vastResponse.inline = vastTag;
                    dispatcher.trigger(requestEndEvent);
                    resolve(vastResponse);
                } else {
                    vastResponse.wrappers.push(vastTag);
                    dispatcher.trigger(requestEndEvent);

                    childTagUri = vastTag.VAST && vastTag.VAST.Ad && vastTag.VAST.Ad.Wrapper && vastTag.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue;
                    nextRequestConfig = {
                        url: helpers.convertProtocol(childTagUri),
                        extraParams: vastConfig.extraParams,
                        corsCookieDomains: vastConfig.corsCookieDomains
                    };

                    getVast(vastResponse, nextRequestConfig, true)
                        .then(resolve)
                        ['catch'](reject);      // eslint-disable-line no-unexpected-multiline
                }
            };

            settings.error = function(jqXHR, textStatus, errorThrown) {
                var code,
                    requestEndEvent,
                    statusText;

                if (jqXHR.status === 0 && textStatus !== 'timeout' && sendCookies) {
                    getVast(vastResponse, vastConfig, false)
                        .then(resolve)
                        ['catch'](reject);      // eslint-disable-line no-unexpected-multiline
                    return
                }

                if (jqXHR.status === 200 && !jqXHR.responseXML) {
                    code = vastErrorCodes.XML_PARSE_ERROR.code;
                    statusText = vastErrorCodes.XML_PARSE_ERROR.message;
                } else {
                    code = vastErrorCodes.WRAPPER_URI_TIMEOUT.code;
                    statusText = jqXHR.statusText;
                }

                requestEndEvent = $.Event('requestEnd', {
                    requestNumber: currentRequestNumber,
                    uri: url,
                    vastResponse: vastResponse,
                    error: {
                        status: jqXHR.status,
                        statusText: statusText
                    }
                });

                vastResponse.addRawResponse({
                    requestNumber: currentRequestNumber,
                    uri: url,
                    response: jqXHR.responseText,
                    headers: jqXHR.getAllResponseHeaders().trim()
                });

                dispatcher.trigger(requestEndEvent);
                reject(new VastError(code, vastResponse, 'VAST Request Failed (' + textStatus + ' ' + jqXHR.status + ') with message [' + errorThrown + '] for ' + url));
            };

            requestStartEvent = $.Event('requestStart', {
                requestNumber: currentRequestNumber,
                uri: url,
                vastResponse: vastResponse
            });
            dispatcher.trigger(requestStartEvent);

            $.ajax(settings);

            return promise;
        }

        function getVastChain(vastConfig) {
            var vastResponse = new VastResponse();

            return getVast(vastResponse, vastConfig, true);
        }

        return {
            getVastChain: getVastChain,
            addEventListener: addEventListener,
            on: addEventListener
        };
    });

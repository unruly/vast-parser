define(['jquery', './vast-parser', 'q', './vastErrorCodes', './vastError', './model/vastResponse'],
    function($, vastParser, Q, vastErrorCodes, VastError, VastResponse) {

        var AJAX_TIMEOUT = 10000,
            vastRequestCounter = 0,
            dispatcher = $({});

        function getVastChain(vastConfig) {
            var vastResponse = new VastResponse();

            return getVast(vastResponse, vastConfig);
        }

        function addEventListener(eventName, handler) {
            dispatcher.on(eventName, handler);
        }

        function getDomainFromURL(url) {
            var a = window.document.createElement('a');
            a.href = url;
            return a.hostname;
        }

        function getVast(vastResponse, vastConfig) {
            var url = vastConfig.url,
                deferred = Q.defer(),
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

            if ((vastConfig.corsCookieDomains instanceof Array) && vastConfig.corsCookieDomains.indexOf(getDomainFromURL(url)) !== -1) {
                settings.xhrFields = {
                    withCredentials: true
                };
            }

            settings.timeout = AJAX_TIMEOUT;

            settings.success = function(data) {
                var vastTag,
                    childTagUri,
                    nextRequestConfig,
                    requestEndEvent;

                requestEndEvent = $.Event('requestEnd', {
                    requestNumber: currentRequestNumber,
                    uri: url
                });
                dispatcher.trigger(requestEndEvent);

                if (!data) {
                    deferred.reject(new VastError(vastErrorCodes.XML_PARSE_ERROR.code));
                    return;
                }

                vastTag = vastParser.parse(data);

                if (vastTag.VAST.Error) {
                    deferred.reject(new VastError(vastErrorCodes.NO_ADS.code, 'VAST request returned no ads and contains error tag'));
                    return;
                }

                if (!vastTag.VAST.Ad) {
                    deferred.reject(new VastError(vastErrorCodes.NO_ADS.code, 'VAST request returned no ads'));
                    return;
                }

                if (vastTag.VAST && vastTag.VAST.Ad && vastTag.VAST.Ad.InLine) {
                    vastResponse.inline = vastTag;

                    deferred.resolve(vastResponse);
                    return;
                }

                vastResponse.wrappers.push(vastTag);

                childTagUri = vastTag.VAST && vastTag.VAST.Ad && vastTag.VAST.Ad.Wrapper && vastTag.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue;
                nextRequestConfig = {
                    url: childTagUri,
                    extraParams: vastConfig.extraParams,
                    corsCookieDomains: vastConfig.corsCookieDomains
                };

                getVast(vastResponse, nextRequestConfig)
                    .then(deferred.resolve)
                    .fail(deferred.reject)
                    .done();
            };

            settings.error = function(jqXHR, textStatus) {
                var code,
                    requestEndEvent,
                    statusText;

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
                    error: {
                        status: jqXHR.status,
                        statusText: statusText
                    }
                });
                dispatcher.trigger(requestEndEvent);
                deferred.reject(new VastError(code, 'VAST Request Failed (' + textStatus + ' ' + jqXHR.status + ')'));
            };

            requestStartEvent = $.Event('requestStart', {
                requestNumber: currentRequestNumber,
                uri: url
            });
            dispatcher.trigger(requestStartEvent);

            $.ajax(settings);

            return deferred.promise;
        }

        return {
            getVastChain: getVastChain,
            addEventListener: addEventListener,
            on: addEventListener
        };

    });
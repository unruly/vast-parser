import vastParser from './vastParser';
import vastErrorCodes from './vastErrorCodes';
import VastError from './vastError';
import VastResponse from './model/vastResponse';
import helpers from './util/helpers';
import jQuery from 'jquery';

const AJAX_TIMEOUT = 10000;

function getDomainFromURL(url) {
    return new URL(helpers.ensureProtocol(url)).hostname;
}

function domainAllowsCorsCookies(vastConfig, url) {
    if(!(vastConfig.corsCookieDomainBlacklist instanceof Array)) {
        return true;
    }
    return vastConfig.corsCookieDomainBlacklist.indexOf(getDomainFromURL(url)) === -1;
}

export default function(
    {
        PromiseModule = Promise,
        $ = jQuery,
        parseVast = vastParser.parse,
        Response = VastResponse
    } = {}) {

    let vastRequestCounter = 0,
        dispatcher = $({});

    function addEventListener(eventName, handler) {
        dispatcher.on(eventName, handler);
    }

    function getVast(vastResponse, vastConfig, sendCookies) {

        let url = vastConfig.url,
            resolve,
            reject,
            promise = new PromiseModule(function(_resolve, _reject) {

                resolve = _resolve;
                reject = _reject;
            }),
            currentRequestNumber = vastRequestCounter,
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

        if (sendCookies && domainAllowsCorsCookies(vastConfig, url)) {
            settings.xhrFields = {
                withCredentials: true
            };
        }

        settings.timeout = AJAX_TIMEOUT;

        settings.success = function(data, status, jqXHR) {
            let vastTag,
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

            vastTag = parseVast(data);

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
                    corsCookieDomainBlacklist: vastConfig.corsCookieDomainBlacklist
                };

                vastRequestCounter++;
                getVast(vastResponse, nextRequestConfig, true)
                    .then(resolve)
                    .catch(reject);
            }
        };

        settings.error = function(jqXHR, textStatus, errorThrown) {
            let code,
                requestEndEvent,
                statusText;

            if (jqXHR.status === 0 && textStatus !== 'timeout' && sendCookies) {
                getVast(vastResponse, vastConfig, false)
                    .then(resolve)
                    .catch(reject);
                return;
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
        let vastResponse = new Response();
        return getVast(vastResponse, vastConfig, true);
    }

    return {
        getVastChain: getVastChain,
        addEventListener: addEventListener,
        on: addEventListener
    };
}

/*global console:true*/
const { EventEmitter } = require('events');
const vastParser = require('./vast-parser');
const vastErrorCodes = require('./vastErrorCodes');
const VastError = require('./vastError');
const VastResponse = require('./model/vastResponse');
const helpers = require('./util/helpers');

var AJAX_TIMEOUT = 10000;
var vastRequestCounter = 0;
var dispatcher = new EventEmitter();

function addEventListener(eventName, handler) {
    dispatcher.on(eventName, handler);
}

function getDomainFromURL(url) {
    var a = window.document.createElement('a');
    a.href = url;
    return a.hostname;
}

function domainAllowsCorsCookies(vastConfig, url) {
    if(!(vastConfig.corsCookieDomainBlacklist instanceof Array)) {
        return true;
    }

    return vastConfig.corsCookieDomainBlacklist.indexOf(getDomainFromURL(url)) === -1;
}

function getVast(
    vastResponse, vastConfig, sendCookies,
    {
        parseVast = vastParser.parse
    } = {}
) {

    var url = vastConfig.url,
        currentRequestNumber = vastRequestCounter;

    if (vastConfig.extraParams && vastConfig.extraParams.length > 0) {
        if (vastConfig.url.indexOf('?') !== -1) {
            url += '&' + vastConfig.extraParams;
        } else {
            url += '?' + vastConfig.extraParams;
        }
    }

    const settings = {
        headers: vastConfig.headers || {},
        dataType: 'xml'
    };

    if (sendCookies && domainAllowsCorsCookies(vastConfig, url)) {
        Object.assign(settings, {
            credentials: 'include'
        });
    }

    dispatcher.trigger('requestStart', {
        requestNumber: currentRequestNumber,
        uri: url,
        vastResponse: vastResponse
    });

    return fetch(url)
        .catch(function(error) {
            var code,
                requestEndEvent,
                statusText;

            if (sendCookies) {
                console.log('Retrying request without cookies:', url);
                return getVast(vastResponse, vastConfig, false)
            }

            vastResponse.addRawResponse({
                requestNumber: currentRequestNumber,
                uri: url,
                response: '',
                headers: ''
            });

            dispatcher.trigger('requestEnd', {
                requestNumber: currentRequestNumber,
                uri: url,
                vastResponse: vastResponse,
                error: {
                    statusText: error.message
                }
            });
            return Promise.reject(new VastError(vastErrorCodes.WRAPPER_URI_TIMEOUT.code, vastResponse, 'VAST Request Failed (' + error.message + ') for ' + url));
        })
        .then(function(response) {
            var vastTag,
                childTagUri,
                nextRequestConfig;
    
            const requestEndEvent = () => dispatcher.trigger('requestEnd', {
                requestNumber: currentRequestNumber,
                uri: url,
                vastResponse: vastResponse
            });

            if (!response.ok) {
                requestEndEvent();
                return Promise.reject(new VastError(vastErrorCodes.XML_PARSE_ERROR.code, vastResponse));
            }
            return response.text()
                .then(responseText => {
                    vastResponse.addRawResponse({
                        requestNumber: currentRequestNumber,
                        uri: url,
                        response: responseText,
                        headers: response.headers
                    });

                    vastTag = parseVAST(responseText);
                    if (vastTag.VAST.Error) {
                        requestEndEvent();
                        return Promise.reject(new VastError(vastErrorCodes.NO_ADS.code, vastResponse, 'VAST request returned no ads and contains error tag'));
                    }
            
                    if (!vastTag.VAST.Ad) {
                        requestEndEvent();
                        return Promise.reject(new VastError(vastErrorCodes.NO_ADS.code, vastResponse, 'VAST request returned no ads'));
                    }
            
                    if (vastTag.VAST && vastTag.VAST.Ad && vastTag.VAST.Ad.InLine) {
                        vastResponse.inline = vastTag;
                        requestEndEvent();
                        return vastResponse;
                    } else {
                        vastResponse.wrappers.push(vastTag);
                        requestEndEvent();
            
                        childTagUri = vastTag.VAST && vastTag.VAST.Ad && vastTag.VAST.Ad.Wrapper && vastTag.VAST.Ad.Wrapper.VASTAdTagURI.nodeValue;
                        nextRequestConfig = {
                            url: helpers.convertProtocol(childTagUri),
                            extraParams: vastConfig.extraParams,
                            corsCookieDomainBlacklist: vastConfig.corsCookieDomainBlacklist
                        };
            
                        vastRequestCounter++;
                        return getVast(vastResponse, nextRequestConfig, true)
                    }
                })
        });
}

function getVastChain(vastConfig) {
    var vastResponse = new VastResponse();

    return getVast(vastResponse, vastConfig, true);
}

module.exports = {
    getVastChain: getVastChain,
    addEventListener: addEventListener,
    on: addEventListener
};
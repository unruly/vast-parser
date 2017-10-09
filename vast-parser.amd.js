define(['jquery'], function (jQuery) { 'use strict';

jQuery = jQuery && jQuery.hasOwnProperty('default') ? jQuery['default'] : jQuery;

var window$1 = window || global;

var Node = Node || {};
var XML_NODE_TYPE = {
    ELEMENT: Node.ELEMENT_NODE || 1,
    TEXT: Node.TEXT_NODE || 3,
    CDATA: Node.CDATA_SECTION_NODE || 4
};

function isTextNodeOrCDATANode(node) {
    return node.nodeType === XML_NODE_TYPE.TEXT ||
       node.nodeType === XML_NODE_TYPE.CDATA;
}

function isElementNodeWithoutPrefix(node) {
    return node.nodeType === XML_NODE_TYPE.ELEMENT && !node.prefix;
}

function JSXMLNode(node) {
    if ('undefined' === typeof node) {
        return this;
    }

    if (node.hasChildNodes()) {
        var text = '',
            childNode, 
            childNodeName, 
            jsXMLNode,
            index;
        
        for (index = 0; index < node.childNodes.length; index++) {
            childNode = node.childNodes.item(index);
            
            if (isTextNodeOrCDATANode(childNode)) {
                text += childNode.nodeValue.trim();
            } else if (isElementNodeWithoutPrefix(childNode)) {
                childNodeName = childNode.nodeName;
                
                jsXMLNode = new JSXMLNode(childNode);
                if (this.hasOwnProperty(childNodeName)) {
                    if (this[childNodeName].constructor !== Array) {
                        this[childNodeName] = [this[childNodeName]];
                    }
                    
                    this[childNodeName].push(jsXMLNode);
                } else {
                    this[childNodeName] = jsXMLNode;
                }
            }
        }
        
        if (text) {
            this.nodeValue = text.trim();
        }
    }

    if (node.attributes && node.hasAttributes && node.hasAttributes()) {
        var attribute,
            attributeIndex;
        
        for (attributeIndex = 0; attributeIndex < node.attributes.length; attributeIndex++) {
            attribute = node.attributes.item(attributeIndex);
            
            this['@' + attribute.name] = attribute.value.trim();
        }
    }
}

var xmlParser = {
    parse : function(doc) {
        var parser;

        if (doc.xml) {
            parser = new window$1.DOMParser();
            doc = parser.parseFromString(doc.xml, 'text/xml');
        }

        return new JSXMLNode(doc);
    }
};

function mustBeArray(item) {
    if(
        item === undefined ||
        // Because Object.keys(new Date()).length === 0 we have to do some additional check
        (typeof item === 'object' && Object.keys(item).length === 0 && item.constructor === Object) ||
        item === null ||
        (typeof item === 'number' && item !== 0 && !item)
    )
    {
        return [];
    }

    return Array.isArray(item) ? item : [item];
}

function ensureArrays(vastInnerObject) {
    if(vastInnerObject.Creatives) {
        vastInnerObject.Creatives.Creative   = mustBeArray(vastInnerObject.Creatives.Creative);
    }

    if(vastInnerObject.Extensions) {
        vastInnerObject.Extensions.Extension = mustBeArray(vastInnerObject.Extensions.Extension);
    }

    vastInnerObject.Impression = mustBeArray(vastInnerObject.Impression);
}

function ensureArraysOnCreatives(vastInnerObject) {
    var creative = vastInnerObject.Creatives.Creative,
        nonLinearCreatives = creative.filter(function(item) { return item.NonLinearAds && item.NonLinearAds.NonLinear; }),
        linearCreatives = creative.filter(function(item) { return item.Linear; });

    nonLinearCreatives.forEach(function(creative) {
        creative.NonLinearAds.NonLinear.NonLinearClickTracking = mustBeArray(creative.NonLinearAds.NonLinear.NonLinearClickTracking);
    });

    linearCreatives.forEach(function(creative) {
        if (creative.Linear.MediaFiles) {
            creative.Linear.MediaFiles.MediaFile = mustBeArray(creative.Linear.MediaFiles.MediaFile);
        }
    });
}

function parse(xmlDocument) {
    var parsedXml = xmlParser.parse(xmlDocument);

    if(!parsedXml.VAST || parsedXml.VAST.Error || !parsedXml.VAST.Ad) {
        return parsedXml;
    }

    if(Array.isArray(parsedXml.VAST.Ad)) {
        parsedXml.VAST.Ad = parsedXml.VAST.Ad[0];
    }

    if (parsedXml.VAST.Ad.Wrapper) {
        ensureArrays(parsedXml.VAST.Ad.Wrapper);
        if (parsedXml.VAST.Ad.Wrapper.Creatives) {
            ensureArraysOnCreatives(parsedXml.VAST.Ad.Wrapper);
        }
    } else if (parsedXml.VAST.Ad.InLine) {
        ensureArrays(parsedXml.VAST.Ad.InLine);
        ensureArraysOnCreatives(parsedXml.VAST.Ad.InLine);
    }

    return parsedXml;
}

var vastParser = {
    parse: parse
};

var vastErrorCodes = {
    XML_PARSE_ERROR: {
        code: 100,
        message: 'XML parsing error.'
    },
    VAST_SCHEMA_ERROR: {
        code: 101,
        message: 'VAST schema validation error.'
    },
    GENERAL_WRAPPER_ERROR: {
        code: 300,
        message: 'General Wrapper error.'
    },
    WRAPPER_URI_TIMEOUT: {
        code: 301,
        message: 'Timeout of VAST URI provided in Wrapper element,' +
                 ' or of VAST URI provided in a subsequent Wrapper element.' +
                 ' (URI was either unavailable or reached a timeout as defined by the video player.)'
    },
    NO_ADS: {
        code: 303,
        message: 'No Ads VAST response after one or more Wrappers.'
    },
    NO_AD_AT_URI: {
        code: 401,
        message: 'File not found. Unable to find Linear/MediaFile from URI.'
    }
};

function isDefined(element) {
    return typeof element !== 'undefined' && element !== null;
}

function flatten(array) {
    return [].concat.apply([], array);
}

function getArrayFromObjectPath(object, path) {
    var pathSections = path.split('.'),
        head,
        tail,
        next,
        defaultValue = [];

    if(object instanceof Array) {
        return flatten(object.map(function(nextItem) {
            return getArrayFromObjectPath(nextItem, path);
        }));
    }

    object = object || defaultValue;

    if (pathSections.length === 1) {
        var item = object[path];

        if (!isDefined(item)) {
            return defaultValue;
        }

        if (!(item instanceof Array)) {
            item = [item];
        }

        return item;
    }

    head = pathSections[0];
    tail = pathSections.slice(1).join('.');
    next = object[head];

    if (!isDefined(next)) {
        return defaultValue;
    }

    return getArrayFromObjectPath(next, tail);
}

function getFromObjectPath(object, path, defaultValue) {
    var results = getArrayFromObjectPath(object, path);

    if (!isDefined(results[0])) {
        return defaultValue;
    }

    return results[0];
}

function getIntegerFromObjectPath(object, path, defaultValue) {
    var value = getFromObjectPath(object, path, defaultValue);

    value = parseInt(value, 10);

    if (isNaN(value)) {
        return defaultValue;
    } else {
        return value;
    }
}

function pluckNodeValue(element) {
    if(!element) {
        return;
    }
    return element.nodeValue;
}

function getErrorMessageFromCode(code) {
    var errorName,
        error;

    for (errorName in vastErrorCodes) {
        if (vastErrorCodes.hasOwnProperty(errorName)) {
            error = vastErrorCodes[errorName];

            if (error.code === code) {
                return error.message;
            }
        }
    }

    return 'Unknown error code';
}

function extractErrorURIs(vastResponse) {
    var errorURIs = [],
        wrapperErrorArrays;

    if (vastResponse) {
        wrapperErrorArrays = getArrayFromObjectPath(vastResponse, 'wrappers').map(function getWrapperErrors(wrapper) {
            return []
                .concat(getArrayFromObjectPath(wrapper, 'VAST.Error'))
                .concat(getArrayFromObjectPath(wrapper, 'VAST.Ad.Wrapper.Error'));
        });

        errorURIs = flatten(wrapperErrorArrays)
            .concat(getArrayFromObjectPath(vastResponse, 'inline.VAST.Error'))
            .concat(getArrayFromObjectPath(vastResponse, 'inline.VAST.Ad.InLine.Error'))
            .map(pluckNodeValue)
            .filter(isDefined);
    }

    return errorURIs;
}

function VastError(code, vastResponse, message) {
    this.name = 'VastError';
    this.code = code;
    this.message = 'VAST Error: [' + code + '] - ' + (message || getErrorMessageFromCode(code));
    this.stack = (new Error()).stack;
    this.errorURIs = extractErrorURIs(vastResponse);
    this.vastResponse = vastResponse;
    }

    VastError.prototype = new Error();
    VastError.prototype.constructor = VastError;

    VastError.prototype.getErrorURIs = function() {
    return this.errorURIs;
};

function getSecondsFromTimeString(timeString) {
    var durationInSeconds = 0,
        timeSegments;

    if(typeof timeString !== 'string') {
        return;
    }

    timeSegments = timeString.split(':');

    if(timeSegments.length !== 3) {
        return;
    }

    timeSegments.forEach(function(timeSegment, i) {
        durationInSeconds += (parseFloat(timeSegment, 10) * Math.pow(60, 2 - i));
    });

    return durationInSeconds;
}

function decodeXML(encodedXMLString) {
    return encodedXMLString.replace(/&apos;/g, '\'')
                            .replace(/&quot;/g, '"')
                            .replace(/&gt;/g, '>')
                            .replace(/&lt;/g, '<')
                            .replace(/&amp;/g, '&');
}

function convertProtocol(url) {
    if(url.indexOf('https') === 0) {
        return url;
    } else if(url.indexOf('http') === 0) {
        return url.substr(5);
    } else {
        return url;
    }
}

function ensureProtocol(url) {
    if(url.indexOf('https') === 0 || url.indexOf('http') === 0) {
        return url
    } else if(url.indexOf('//') === 0) {
        return `https:${url}`;
    } else {
        return url;
    }
}

function isNonEmptyString(string) {
    return !!string && string.trim().length > 0;
}

var helpers = {
    getSecondsFromTimeString: getSecondsFromTimeString,
    decodeXML: decodeXML,
    ensureProtocol: ensureProtocol,
    convertProtocol: convertProtocol,
    isNonEmptyString: isNonEmptyString
};

function VastMediaFile(mediaFileXml) {
    this.url = helpers.convertProtocol(getFromObjectPath(mediaFileXml, 'nodeValue'));
    this.apiFramework = getFromObjectPath(mediaFileXml, '@apiFramework');
    this.type = getFromObjectPath(mediaFileXml, '@type');
    this.width = getIntegerFromObjectPath(mediaFileXml, '@width');
    this.height = getIntegerFromObjectPath(mediaFileXml, '@height');
    this.delivery = getFromObjectPath(mediaFileXml, '@delivery');
    this.bitrate = getIntegerFromObjectPath(mediaFileXml, '@bitrate');
}

VastMediaFile.prototype.isMP4 = function() {
    return this.delivery === 'progressive' && this.type === 'video/mp4';
};

VastMediaFile.prototype.isFlashVPAID = function() {
    return this.apiFramework === 'VPAID' && this.type === 'application/x-shockwave-flash';
};

VastMediaFile.prototype.isJavascriptVPAID = function() {
    return this.apiFramework === 'VPAID' && this.type === 'application/javascript';
};

function VastIcon(iconXMLJson) {
    this.program = getFromObjectPath(iconXMLJson, '@program', 'unknown');
    this.width = getIntegerFromObjectPath(iconXMLJson, '@width', 0);
    this.height = getIntegerFromObjectPath(iconXMLJson, '@height', 0);
    this.xPosition = getFromObjectPath(iconXMLJson, '@xPosition', 'top');
    this.yPosition = getFromObjectPath(iconXMLJson, '@yPosition', 'right');
    this.clickThrough = helpers.convertProtocol(getFromObjectPath(iconXMLJson, 'IconClicks.IconClickThrough.nodeValue', ''));
    this.resource = {
        type: getFromObjectPath(iconXMLJson, 'StaticResource.@creativeType', ''),
        url: helpers.convertProtocol(getFromObjectPath(iconXMLJson, 'StaticResource.nodeValue', ''))
    };
    this.clickTracking = getArrayFromObjectPath(iconXMLJson, 'IconClicks.IconClickTracking')
        .map(function(trackingObject) {
            return helpers.convertProtocol(trackingObject.nodeValue);
        });
}

function nonEmptyString(trackingObject) {
    return helpers.isNonEmptyString(trackingObject.nodeValue);
}

function VastLinearCreative(vastResponse) {
    this.vastResponse = vastResponse;
    this.linearInline =  getFromObjectPath(this.vastResponse, 'inline.VAST.Ad.InLine.Creatives.Creative.Linear');
    this.linearWrappers =  getArrayFromObjectPath(this.vastResponse, 'wrappers.VAST.Ad.Wrapper.Creatives.Creative.Linear');
}

VastLinearCreative.prototype.getDuration = function getDuration(getSecondsFromTimeString$$1 = helpers.getSecondsFromTimeString) {
    var stringTime = getFromObjectPath(this.linearInline, 'Duration.nodeValue');
    return getSecondsFromTimeString$$1(stringTime);
};

VastLinearCreative.prototype.getClickTrackers = function getClickTrackers(clickTrackerId) {
    var wrapperClickTracking = getArrayFromObjectPath(this.linearWrappers, 'VideoClicks.ClickTracking'),
        inlineClickTracking = getArrayFromObjectPath(this.linearInline, 'VideoClicks.ClickTracking'),
        allClickTracking = inlineClickTracking.concat(wrapperClickTracking);

    return allClickTracking
        .filter(nonEmptyString)
        .filter(function(trackingObject) {
            if ('undefined' === typeof trackingObject['@id']) {
                return true;
            }

            return clickTrackerId ? trackingObject['@id'] === clickTrackerId : true;
        })
        .map(function(trackingObject) {
            return helpers.convertProtocol(trackingObject.nodeValue);
        });
};

VastLinearCreative.prototype.getAllClickTrackersAsMap = function getAllClickTrackersAsMap() {
    var wrapperClickTracking = getArrayFromObjectPath(this.linearWrappers, 'VideoClicks.ClickTracking'),
        inlineClickTracking = getArrayFromObjectPath(this.linearInline, 'VideoClicks.ClickTracking'),
        allClickTracking = inlineClickTracking.concat(wrapperClickTracking);

    var defaultID = 'unknown';

    function byID(trackersMap, trackingObject) {
        var id = trackingObject['@id'] || defaultID;
        var url = helpers.convertProtocol(trackingObject.nodeValue);
        var group = trackersMap[id] || [];

        group = group.concat([url]);
        trackersMap[id] = group;
        return trackersMap;
    }

    return allClickTracking
        .filter(nonEmptyString)
        .reduce(byID, {});
};

VastLinearCreative.prototype.getClickThrough = function getClickThrough() {
    return getFromObjectPath(this.linearInline, 'VideoClicks.ClickThrough.nodeValue');
};

VastLinearCreative.prototype.getTrackingEvents = function getTrackingEvents(eventName) {

    function getAllTrackingEvents() {
        return getArrayFromObjectPath(this.linearInline, 'TrackingEvents.Tracking')
            .concat(getArrayFromObjectPath(this.linearWrappers, 'TrackingEvents.Tracking'));
    }

    this.trackingEvents = this.trackingEvents || getAllTrackingEvents.call(this);

    return this.trackingEvents
        .filter(function(trackingObject) {
            return trackingObject['@event'] === eventName && helpers.isNonEmptyString(trackingObject.nodeValue);
        })
        .map(function(trackingObject) {
            return helpers.convertProtocol(trackingObject.nodeValue);
        });
};

VastLinearCreative.prototype.getAdParameters = function getAdParameters() {
    var adParameters = getFromObjectPath(this.linearInline, 'AdParameters.nodeValue'),
        xmlEncoded = getFromObjectPath(this.linearInline, 'AdParameters.@xmlEncoded');

    if(xmlEncoded === 'true' && typeof adParameters === 'string') {
        adParameters = helpers.decodeXML(adParameters);
    }

    return adParameters;
};

VastLinearCreative.prototype.getIcons = function getIcons() {

    var createIcon = function(iconJSXml) {
            return new VastIcon(iconJSXml);
        },
        hasValidProgram = function(icon) {
            return icon.program && icon.program !== 'unknown';
        },
        chooseClosestProgram = function(programDict, icon) {
            programDict[icon.program] = icon;
            return programDict;
        };

    return getArrayFromObjectPath(this.linearWrappers, 'Icons.Icon')
                        .concat(getArrayFromObjectPath(this.linearInline, 'Icons.Icon'))
                        .map(createIcon)
                        .filter(hasValidProgram)
                        .reduce(chooseClosestProgram, {});
};

VastLinearCreative.prototype.getMediaFiles = function getMediaFiles(filter) {
    var mediaFiles = getArrayFromObjectPath(this.linearInline, 'MediaFiles.MediaFile');

    filter = filter || {};

    mediaFiles = mediaFiles.map(function (vastMediaFileXml) {
        return new VastMediaFile(vastMediaFileXml);
    });

    mediaFiles = mediaFiles.filter(function(vastMediaFileXml) {
        var property,
            matchesFilter = true;

        for (property in filter) {
            if (filter.hasOwnProperty(property)) {
                matchesFilter = matchesFilter && vastMediaFileXml[property] === filter[property];
            }
        }

        return matchesFilter;
    });

    return mediaFiles;
};

VastLinearCreative.prototype.getFlashVPAIDMediaFiles = function getFlashVPAIDMediaFiles() {
    return this.getMediaFiles({
        apiFramework: 'VPAID',
        type: 'application/x-shockwave-flash'
    });
};

VastLinearCreative.prototype.getJavascriptVPAIDMediaFiles = function getJavascriptVPAIDMediaFiles() {
    return this.getMediaFiles({
        apiFramework: 'VPAID',
        type: 'application/javascript'
    });
};

VastLinearCreative.prototype.getMp4MediaFiles = function getMp4MediaFiles() {
    return this.getMediaFiles({
        type: 'video/mp4',
        delivery: 'progressive'
    });
};

VastLinearCreative.prototype.hasFlashVPAID = function hasFlashVPAID() {
    return this.getFlashVPAIDMediaFiles().length > 0;
};

VastLinearCreative.prototype.hasJavascriptVPAID = function hasJavascriptVPAID() {
    return this.getJavascriptVPAIDMediaFiles().length > 0;
};

VastLinearCreative.prototype.hasMp4 = function hasMp4() {
    return this.getMp4MediaFiles().length > 0;
};

function VastNonLinearCreative(vastResponse) {
    this.nonLinearInline =  getFromObjectPath(vastResponse, 'inline.VAST.Ad.InLine.Creatives.Creative.NonLinearAds');
}

VastNonLinearCreative.prototype.getStaticResource = function getStaticResource(convertProtocol$$1 = helpers.convertProtocol) {
    var url = getFromObjectPath(this.nonLinearInline, 'NonLinear.StaticResource.nodeValue');

    if(url) {
        return convertProtocol$$1(url);
    }
};

function VastExtension(extensionNodes) {
    this.extension = extensionNodes;
}

VastExtension.prototype.getExtensionNodes = function() {
    return this.extension;
};

VastExtension.prototype.getDetailsByPath = function (path) {
    return getArrayFromObjectPath(this.extension, path);
};

var vastModelFactory = {
    createVastExtension: function(extensionNodes) {
        return new VastExtension(extensionNodes);
    }
};

function VastResponse(vastChain) {
    this.wrappers = [];
    this.inline = undefined;
    this._raw = [];

    if (vastChain) {
        this.wrappers = vastChain.wrappers;
        this.inline = vastChain.inline;
    }

    this._vastChain = vastChain;
}

VastResponse.prototype.getImpressions = function() {
    var inlineImps = getArrayFromObjectPath(this.inline, 'VAST.Ad.InLine.Impression.nodeValue'),
        wrapperImps = getArrayFromObjectPath(this.wrappers, 'VAST.Ad.Wrapper.Impression.nodeValue');

    return inlineImps.concat(wrapperImps).filter(helpers.isNonEmptyString);
};

VastResponse.prototype.getAdTitle = function() {
    return this.inline.VAST.Ad.InLine.AdTitle.nodeValue;
};

VastResponse.prototype.getLinearCreative = function(LinearCreative = VastLinearCreative) {
    if (!this.linearCreative) {
        var hasLinearCreative = getFromObjectPath(this.inline, 'VAST.Ad.InLine.Creatives.Creative.Linear');

        if (hasLinearCreative) {
            this.linearCreative = new LinearCreative(this);
        }
    }
    return this.linearCreative;
};

VastResponse.prototype.getNonLinearCreative = function(NonLinearCreative = VastNonLinearCreative) {
    if (!this.nonLinearCreative) {
        var hasNonLinearCreative = getFromObjectPath(this.inline, 'VAST.Ad.InLine.Creatives.Creative.NonLinearAds');

        if (hasNonLinearCreative) {
            this.nonLinearCreative = new NonLinearCreative(this);
        }
    }
    return this.nonLinearCreative;
};

VastResponse.prototype.getRawResponses = function() {
    return this._raw;
};

VastResponse.prototype.addRawResponse = function(data) {
    this._raw.push(data);
};

VastResponse.prototype.getExtensions = function(createVastExtension = vastModelFactory.createVastExtension) {
    var inlineExtensions = getArrayFromObjectPath(this.inline, 'VAST.Ad.InLine.Extensions.Extension'),
        wrapperExtensions = getArrayFromObjectPath(this.wrappers, 'VAST.Ad.Wrapper.Extensions.Extension'),
        allExtensions = inlineExtensions.concat(wrapperExtensions);

    return allExtensions.map(function(ext) {
        return createVastExtension(ext);
    });
};

VastResponse.prototype.getLastVASTURL = function() {
    if(this._raw.length === 0) {
        return undefined;
    }

    var lastVAST = this._raw[this._raw.length - 1];
    return lastVAST.uri;
};

/*global console:true*/

var AJAX_TIMEOUT = 10000;

function getDomainFromURL(url) {
    return new URL(helpers.ensureProtocol(url)).hostname;
}

function domainAllowsCorsCookies(vastConfig, url) {
    if(!(vastConfig.corsCookieDomainBlacklist instanceof Array)) {
        return true;
    }
    return vastConfig.corsCookieDomainBlacklist.indexOf(getDomainFromURL(url)) === -1;
}

var vastChainer = function(
    {
        PromiseModule = Promise,
        $ = jQuery,
        parseVast = vastParser.parse,
        Response = VastResponse
    } = {}) {

    var vastRequestCounter = 0,
        dispatcher = $({});

    function addEventListener(eventName, handler) {
        dispatcher.on(eventName, handler);
    }

    function getVast(vastResponse, vastConfig, sendCookies) {

        var url = vastConfig.url,
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
                    ['catch'](reject);      // eslint-disable-line no-unexpected-multiline
            }
        };

        settings.error = function(jqXHR, textStatus, errorThrown) {
            var code,
                requestEndEvent,
                statusText;

            if (jqXHR.status === 0 && textStatus !== 'timeout' && sendCookies) {
                console.log('Retrying request without cookies:', url);

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
        var vastResponse = new Response();

        return getVast(vastResponse, vastConfig, true);
    }

    return {
        getVastChain: getVastChain,
        addEventListener: addEventListener,
        on: addEventListener
    };
};

var VastAdManager = function(chainer = vastChainer()) {
    return {
        requestVastChain: chainer.getVastChain,
        addEventListener: chainer.addEventListener
    }
};

var index = {
    VastParser: vastParser,
    VastErrorCodes: vastErrorCodes,
    VastResponse,
    VastIcon,
    VastError,
    VastAdManager,
    helpers
};

return index;

});

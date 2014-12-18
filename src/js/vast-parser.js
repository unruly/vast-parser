define(['./xml-parser'], function(xmlParser) {

    function isEmpty(obj) {
        var prop;

        for(prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                return false;
            }
        }

        return true;
    }

    function mustBeArray(item) {
        if(item === undefined || (typeof item === "object" && isEmpty(item)) || item === null || (typeof item === 'number' && item !==0 && !item)) {
            return [];
        }

        if(!Array.isArray(item)) {
            return [item];
        }
        return item;
    }

    function ensureArrays(vastInnerObject) {
        if(vastInnerObject.Creatives) {
            vastInnerObject.Creatives.Creative   = mustBeArray(vastInnerObject.Creatives.Creative);
        }

        if(vastInnerObject.Extensions) {
            vastInnerObject.Extensions.Extension = mustBeArray(vastInnerObject.Extensions.Extension);
        }

        vastInnerObject.Impression = mustBeArray(vastInnerObject.Impression);

        return vastInnerObject;
    }

    function filter(array, fun/*, thisArg*/) {
        'use strict';

        if (array === void 0 || array === null) {
            throw new TypeError();
        }

        var t = Object(array);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 3 ? arguments[2] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    }

    function forEach(array, callback) {
        var i = 0;

        for(; i < array.length; i += 1) {
            callback(array[i]);
        }
    }

    function ensureArraysOnInnerObject(vastInnerObject) {
        var creative = vastInnerObject.Creatives.Creative,
            nonLinearCreatives = filter(creative, function(item) { return item.NonLinearAds;}, creative),
            linearCreatives = filter(creative, function(item) { return item.Linear; }, creative);

        forEach(nonLinearCreatives, function(creative) {
            creative.NonLinearAds.NonLinear.NonLinearClickTracking = mustBeArray(creative.NonLinearAds.NonLinear.NonLinearClickTracking);
        });

        forEach(linearCreatives, function(creative) {
            if (creative.Linear.MediaFiles) {
                creative.Linear.MediaFiles.MediaFile = mustBeArray(creative.Linear.MediaFiles.MediaFile);
            }
        });

        return vastInnerObject;
    }

    function parse(xmlDocument) {
        var parsedXml = xmlParser.parse(xmlDocument);

        if(!parsedXml.VAST || parsedXml.VAST.Error || !parsedXml.VAST.Ad) {
            return parsedXml;
        }

        if (parsedXml.VAST.Ad.Wrapper) {
            parsedXml.VAST.Ad.Wrapper = ensureArrays(parsedXml.VAST.Ad.Wrapper);
            parsedXml.VAST.Ad.Wrapper = ensureArraysOnInnerObject(parsedXml.VAST.Ad.Wrapper);
        } else if (parsedXml.VAST.Ad.InLine) {
            parsedXml.VAST.Ad.InLine = ensureArrays(parsedXml.VAST.Ad.InLine);
            parsedXml.VAST.Ad.InLine = ensureArraysOnInnerObject(parsedXml.VAST.Ad.InLine);
        }

        return parsedXml;
    }

    return {
        parse: parse
    };
});
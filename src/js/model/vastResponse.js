define(['../util/helpers', '../util/objectUtil', './vastLinearCreative', './vastExtension', './vastModelFactory'], function(helpers, objectUtil, VastLinearCreative, VastExtension, vastModelFactory) {

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

    function isValidURL(url) {
        return helpers.isURL(url, { allow_protocol_relative_urls: true });
    }

    VastResponse.prototype.getImpressions = function() {
        var inlineImps = objectUtil.getArrayFromObjectPath(this.inline, 'VAST.Ad.InLine.Impression.nodeValue'),
            wrapperImps = objectUtil.getArrayFromObjectPath(this.wrappers, 'VAST.Ad.Wrapper.Impression.nodeValue');

        return inlineImps.concat(wrapperImps).filter(isValidURL);
    };

    VastResponse.prototype.getAdTitle = function() {
        return this.inline.VAST.Ad.InLine.AdTitle.nodeValue;
    };

    VastResponse.prototype.getLinearCreative = function() {
        if (!this.linearCreative) {
            var hasLinearCreative = objectUtil.getFromObjectPath(this.inline, 'VAST.Ad.InLine.Creatives.Creative.Linear');

            if (hasLinearCreative) {
                this.linearCreative = new VastLinearCreative.VastLinearCreative(this);
            }
        }
        return this.linearCreative;
    };

    VastResponse.prototype.getRawResponses = function() {
        return this._raw;
    };

    VastResponse.prototype.addRawResponse = function(data) {
        this._raw.push(data);
    };

    VastResponse.prototype.getExtensions = function() {
        var inlineExtensions = objectUtil.getArrayFromObjectPath(this.inline, 'VAST.Ad.InLine.Extensions.Extension'),
            wrapperExtensions = objectUtil.getArrayFromObjectPath(this.wrappers, 'VAST.Ad.Wrapper.Extensions.Extension'),
            allExtensions = inlineExtensions.concat(wrapperExtensions);

        return allExtensions.map(function(ext) {
           return vastModelFactory.createVastExtension(ext);
        });
    };

    return VastResponse;

});

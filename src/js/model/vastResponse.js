const helpers = require('../util/helpers');
const objectUtil = require('../util/objectUtil');
const VastLinearCreative = require('./vastLinearCreative');
const VastNonLinearCreative = require('./vastNonLinearCreative');
const VastExtension = require('./vastExtension');
const vastModelFactory = require('./vastModelFactory');

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
    var inlineImps = objectUtil.getArrayFromObjectPath(this.inline, 'VAST.Ad.InLine.Impression.nodeValue'),
        wrapperImps = objectUtil.getArrayFromObjectPath(this.wrappers, 'VAST.Ad.Wrapper.Impression.nodeValue');

    return inlineImps.concat(wrapperImps).filter(helpers.isNonEmptyString);
};

VastResponse.prototype.getAdTitle = function() {
    return this.inline.VAST.Ad.InLine.AdTitle.nodeValue;
};

VastResponse.prototype.getLinearCreative = function(LinearCreative = VastLinearCreative) {
    if (!this.linearCreative) {
        var hasLinearCreative = objectUtil.getFromObjectPath(this.inline, 'VAST.Ad.InLine.Creatives.Creative.Linear');

        if (hasLinearCreative) {
            this.linearCreative = new LinearCreative(this);
        }
    }
    return this.linearCreative;
};

VastResponse.prototype.getNonLinearCreative = function(NonLinearCreative = VastNonLinearCreative) {
    if (!this.nonLinearCreative) {
        var hasNonLinearCreative = objectUtil.getFromObjectPath(this.inline, 'VAST.Ad.InLine.Creatives.Creative.NonLinearAds');

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
    var inlineExtensions = objectUtil.getArrayFromObjectPath(this.inline, 'VAST.Ad.InLine.Extensions.Extension'),
        wrapperExtensions = objectUtil.getArrayFromObjectPath(this.wrappers, 'VAST.Ad.Wrapper.Extensions.Extension'),
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

module.exports =  VastResponse;
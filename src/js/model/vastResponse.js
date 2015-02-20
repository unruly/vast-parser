define(['../../../node_modules/validator/validator', '../util/objectUtil'], function(validator, objectUtil) {

    function VastResponse(vastChain) {
        this.wrappers = [];
        this.inline = undefined;

        if (vastChain) {
            this.wrappers = vastChain.wrappers;
            this.inline = vastChain.inline;
        }
    }

    function isValidURL(url) {
        return validator.isURL(url);
    }

    VastResponse.prototype.getImpressions = function() {
        var inlineImps = objectUtil.getArrayFromObjectPath(this.inline, 'VAST.Ad.InLine.Impression.nodeValue'),
            wrapperImps = objectUtil.getArrayFromObjectPath(this.wrappers, 'VAST.Ad.Wrapper.Impression.nodeValue');

        return inlineImps.concat(wrapperImps).filter(isValidURL);
    };

    VastResponse.prototype.getAdTitle = function() {
        return this.inline.VAST.Ad.InLine.AdTitle.nodeValue;
    };

    return VastResponse;

});

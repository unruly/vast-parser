define(['../../../node_modules/validator/validator', '../util/objectUtil'], function(validator, objectUtil) {
    var pluckNodeValue = objectUtil.pluckNodeValue;

    function VastResponse(vastChain) {
        this.wrappers = vastChain ? vastChain.wrappers : [];
        this.inline = vastChain ? vastChain.inline : undefined;
    }

    function isValidURL(url) {
        return validator.isURL(url);
    }

    VastResponse.prototype.getImpressions = function() {
        var impressions = [];

        if(this.inline.VAST.Ad.InLine.Impression) {
            impressions = this.inline.VAST.Ad.InLine.Impression.map(pluckNodeValue);
        }

        this.wrappers.filter(function(wrapper){
            return !!wrapper.VAST.Ad.Wrapper.Impression;
        }).forEach(function(wrapper) {
           impressions = impressions.concat(wrapper.VAST.Ad.Wrapper.Impression.map(pluckNodeValue));
        });

        return impressions.filter(isValidURL);
    };

    VastResponse.prototype.getAdTitle = function() {
        return this.inline.VAST.Ad.InLine.AdTitle.nodeValue;
    };

    return VastResponse;

});

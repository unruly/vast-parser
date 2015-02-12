define(['validator'], function(validator) {

    function VastResponse(vastChain) {
        this.wrappers = vastChain.wrappers;
        this.inline = vastChain.inline;
    }

    function pluckValue(element) {
        return element.nodeValue;
    }

    function isValidURL(url) {
        return validator.isURL(url);
    }

    VastResponse.prototype.getImpressions = function() {
        var impressions = [];

        if(this.inline.VAST.Ad.InLine.Impression) {
            impressions = this.inline.VAST.Ad.InLine.Impression.map(pluckValue);
        }

        this.wrappers.filter(function(wrapper){
            return !!wrapper.VAST.Ad.Wrapper.Impression;
        }).forEach(function(wrapper) {
           impressions = impressions.concat(wrapper.VAST.Ad.Wrapper.Impression.map(pluckValue));
        });

        return impressions.filter(isValidURL);
    };

    return VastResponse;

});

define(['../util/objectUtil', '../util/helpers'], function(objectUtil, helpers) {
    function VastNonLinearCreative(vastResponse) {
        this.nonLinearInline =  objectUtil.getFromObjectPath(vastResponse, 'inline.VAST.Ad.InLine.Creatives.Creative.NonLinearAds');
    }

    VastNonLinearCreative.prototype.getStaticResource = function getStaticResource() {
        var url = objectUtil.getFromObjectPath(this.nonLinearInline, 'NonLinear.StaticResource.nodeValue');

        if(url) {
            return helpers.convertProtocol(url);
        }
    };

    return {
        VastNonLinearCreative: VastNonLinearCreative
    };
});

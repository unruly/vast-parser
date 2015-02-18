define(['../util/objectUtil', '../util/helpers'], function(objectUtil, helpers) {
    function VastLinearCreative(vastResponse) {
        this.vastResponse = vastResponse;
        this.linearInline = objectUtil.getArrayFromObjectPath(this.vastResponse, 'inline.VAST.Ad.InLine.Creatives.Creative').filter(function(creative) {
            return creative.Linear;
        }).map(function(creative) {
            return creative.Linear;
        })[0];
    }

    VastLinearCreative.prototype.getDuration = function getDuration() {
        var stringTime = objectUtil.pluckNodeValue(this.linearInline.Duration);
        return helpers.getSecondsFromTimeString(stringTime);
    };

    return VastLinearCreative;
});

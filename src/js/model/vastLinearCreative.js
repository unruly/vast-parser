define(['../util/objectUtil', '../util/helpers'], function(objectUtil, helpers) {
    function VastLinearCreative(vastResponse) {
        this.vastResponse = vastResponse;
        this.linearInline =  objectUtil.getFromObjectPath(this.vastResponse, 'inline.VAST.Ad.InLine.Creatives.Creative.Linear');
        this.linearWrappers =  objectUtil.getArrayFromObjectPath(this.vastResponse, 'wrappers.VAST.Ad.Wrapper.Creatives.Creative.Linear');
    }

    VastLinearCreative.prototype.getDuration = function getDuration() {
        var stringTime = objectUtil.getFromObjectPath(this.linearInline, 'Duration.nodeValue');
        return helpers.getSecondsFromTimeString(stringTime);
    };

    VastLinearCreative.prototype.getClickTrackers = function getClickTrackers() {
        var wrapperClickTracking = objectUtil.getArrayFromObjectPath(this.linearWrappers, 'VideoClicks.ClickTracking.nodeValue'),
            inlineClickTracking = objectUtil.getArrayFromObjectPath(this.linearInline, 'VideoClicks.ClickTracking.nodeValue');

        return inlineClickTracking.concat(wrapperClickTracking);
    };

    return {
        VastLinearCreative: VastLinearCreative
    };
});

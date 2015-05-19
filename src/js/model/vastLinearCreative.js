define(['util/objectUtil', 'util/helpers', 'model/vastMediaFile'], function(objectUtil, helpers, VastMediaFile) {
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

    VastLinearCreative.prototype.getMediaFiles = function getMediaFiles() {
      var mediaFiles =  objectUtil.getArrayFromObjectPath(this.linearInline, 'MediaFiles.MediaFile');

        return mediaFiles.map(function (vastMediaFileXml) {
            return new VastMediaFile(vastMediaFileXml);
        });
    };

    VastLinearCreative.prototype.hasFlashVPAID = function hasFlashVPAID() {
        var flashVPAIDMediaFiles = this.getMediaFiles().filter(function(mediaFile) {
            return mediaFile.apiFramework === 'VPAID' && mediaFile.type === 'application/x-shockwave-flash';
        });

        return flashVPAIDMediaFiles.length > 0;
    };

    VastLinearCreative.prototype.hasJavascriptVPAID = function hasJavascriptVPAID() {
        var javascriptVPAIDMediaFiles = this.getMediaFiles().filter(function(mediaFile) {
            return mediaFile.apiFramework === 'VPAID' && mediaFile.type === 'application/javascript';
        });

        return javascriptVPAIDMediaFiles.length > 0;
    };

    VastLinearCreative.prototype.hasMp4 = function hasMp4() {
        var mp4MediaFiles = this.getMediaFiles().filter(function(mediaFile) {
            return mediaFile.type === 'video/mp4';
        });

        return mp4MediaFiles.length > 0;
    };

    return {
        VastLinearCreative: VastLinearCreative
    };
});

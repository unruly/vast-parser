define(['../util/objectUtil'], function(objectUtil) {

    function VastMediaFile(mediaFileXml) {
        this.url = objectUtil.getFromObjectPath(mediaFileXml, 'nodeValue');
        this.apiFramework = objectUtil.getFromObjectPath(mediaFileXml, '@apiFramework');
        this.type = objectUtil.getFromObjectPath(mediaFileXml, '@type');
        this.width = objectUtil.getIntegerFromObjectPath(mediaFileXml, '@width');
        this.height = objectUtil.getIntegerFromObjectPath(mediaFileXml, '@height');
        this.delivery = objectUtil.getFromObjectPath(mediaFileXml, '@delivery');
        this.bitrate = objectUtil.getIntegerFromObjectPath(mediaFileXml, '@bitrate');
    }

    VastMediaFile.prototype.isMP4 = function() {
        return this.delivery === 'progressive' && this.type === 'video/mp4';
    };

    VastMediaFile.prototype.isFlashVPAID = function() {
        return this.apiFramework === 'VPAID' && this.type === 'application/x-shockwave-flash';
    };

    VastMediaFile.prototype.isJavascriptVPAID = function() {
        return this.apiFramework === 'VPAID' && this.type === 'application/javascript';
    };

    return VastMediaFile;
});


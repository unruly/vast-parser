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

    return VastMediaFile;
});


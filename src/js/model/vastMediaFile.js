define(['../util/objectUtil'], function(objectUtil) {

    function VastMediaFile(mediaFileXml) {
        this.url = objectUtil.getFromObjectPath(mediaFileXml, 'nodeValue');
        this.apiFramework = objectUtil.getFromObjectPath(mediaFileXml, '@apiFramework');
        this.type = objectUtil.getFromObjectPath(mediaFileXml, '@type');
        this.width = objectUtil.getFromObjectPath(mediaFileXml, '@width');
        this.height = objectUtil.getFromObjectPath(mediaFileXml, '@height');
        this.delivery = objectUtil.getFromObjectPath(mediaFileXml, '@delivery');
        this.bitrate = objectUtil.getFromObjectPath(mediaFileXml, '@bitrate');
    }

    return VastMediaFile;
});


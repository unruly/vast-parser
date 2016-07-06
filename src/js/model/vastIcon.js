define(['../util/objectUtil', '../util/helpers'], function(objectUtil, helpers) {

    function VastIcon(iconXMLJson) {
        this.program = objectUtil.getFromObjectPath(iconXMLJson, '@program');
        this.width = objectUtil.getIntegerFromObjectPath(iconXMLJson, '@width');
        this.height = objectUtil.getIntegerFromObjectPath(iconXMLJson, '@height');
        this.xPosition = objectUtil.getFromObjectPath(iconXMLJson, '@xPosition');
        this.yPosition = objectUtil.getFromObjectPath(iconXMLJson, '@yPosition');
        this.clickThrough = helpers.convertProtocol(objectUtil.getFromObjectPath(iconXMLJson, 'IconClicks.IconClickThrough.nodeValue'));
        this.resource = {
            type: objectUtil.getFromObjectPath(iconXMLJson, 'StaticResource.@creativeType'),
            url: helpers.convertProtocol(objectUtil.getFromObjectPath(iconXMLJson, 'StaticResource.nodeValue'))
        };
        this.clickTracking = objectUtil.getArrayFromObjectPath(iconXMLJson, 'IconClicks.IconClickTracking')
                                .map(function(trackingObject) {
                                    return helpers.convertProtocol(trackingObject.nodeValue);
                                });
    }

    return VastIcon;
});


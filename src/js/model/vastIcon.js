const objectUtil = require('../util/objectUtil');
const helpers = require('../util/helpers');

function VastIcon(iconXMLJson) {
    this.program = objectUtil.getFromObjectPath(iconXMLJson, '@program', 'unknown');
    this.width = objectUtil.getIntegerFromObjectPath(iconXMLJson, '@width', 0);
    this.height = objectUtil.getIntegerFromObjectPath(iconXMLJson, '@height', 0);
    this.xPosition = objectUtil.getFromObjectPath(iconXMLJson, '@xPosition', 'top');
    this.yPosition = objectUtil.getFromObjectPath(iconXMLJson, '@yPosition', 'right');
    this.clickThrough = helpers.convertProtocol(objectUtil.getFromObjectPath(iconXMLJson, 'IconClicks.IconClickThrough.nodeValue', ''));
    this.resource = {
        type: objectUtil.getFromObjectPath(iconXMLJson, 'StaticResource.@creativeType', ''),
        url: helpers.convertProtocol(objectUtil.getFromObjectPath(iconXMLJson, 'StaticResource.nodeValue', ''))
    };
    this.clickTracking = objectUtil.getArrayFromObjectPath(iconXMLJson, 'IconClicks.IconClickTracking')
        .map(function(trackingObject) {
            return helpers.convertProtocol(trackingObject.nodeValue);
        });
}

module.exports = VastIcon;
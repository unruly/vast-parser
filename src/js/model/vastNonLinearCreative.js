const objectUtil = require('../util/objectUtil');
const helpers = require('../util/helpers');

function VastNonLinearCreative(vastResponse) {
    this.nonLinearInline =  objectUtil.getFromObjectPath(vastResponse, 'inline.VAST.Ad.InLine.Creatives.Creative.NonLinearAds');
}

VastNonLinearCreative.prototype.getStaticResource = function getStaticResource(convertProtocol = helpers.convertProtocol) {
    var url = objectUtil.getFromObjectPath(this.nonLinearInline, 'NonLinear.StaticResource.nodeValue');

    if(url) {
        return convertProtocol(url);
    }
};

module.exports = VastNonLinearCreative;
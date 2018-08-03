import { getFromObjectPath } from '../util/objectUtil'
import helpers from '../util/helpers'

export default function VastNonLinearCreative (vastResponse) {
  this.nonLinearInline = getFromObjectPath(vastResponse, 'inline.VAST.Ad.InLine.Creatives.Creative.NonLinearAds')
}

VastNonLinearCreative.prototype.getStaticResource = function getStaticResource (convertProtocol = helpers.convertProtocol) {
  var url = getFromObjectPath(this.nonLinearInline, 'NonLinear.StaticResource.nodeValue')

  if (url) {
    return convertProtocol(url)
  }
}

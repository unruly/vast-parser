import { getArrayFromObjectPath, getFromObjectPath, getIntegerFromObjectPath } from '../util/objectUtil'
import helpers from '../util/helpers'

export default function VastIcon (iconXMLJson) {
  this.program = getFromObjectPath(iconXMLJson, '@program', 'unknown')
  this.width = getIntegerFromObjectPath(iconXMLJson, '@width', 0)
  this.height = getIntegerFromObjectPath(iconXMLJson, '@height', 0)
  this.xPosition = getFromObjectPath(iconXMLJson, '@xPosition', 'top')
  this.yPosition = getFromObjectPath(iconXMLJson, '@yPosition', 'right')
  this.clickThrough = helpers.convertProtocol(getFromObjectPath(iconXMLJson, 'IconClicks.IconClickThrough.nodeValue', ''))
  this.resource = {
    type: getFromObjectPath(iconXMLJson, 'StaticResource.@creativeType', ''),
    url: helpers.convertProtocol(getFromObjectPath(iconXMLJson, 'StaticResource.nodeValue', ''))
  }
  this.clickTracking = getArrayFromObjectPath(iconXMLJson, 'IconClicks.IconClickTracking')
    .map(function (trackingObject) {
      return helpers.convertProtocol(trackingObject.nodeValue)
    })
}

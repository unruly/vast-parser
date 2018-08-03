import { getFromObjectPath, getIntegerFromObjectPath } from '../util/objectUtil'
import helpers from '../util/helpers'

function VastMediaFile (mediaFileXml) {
  this.url = helpers.convertProtocol(getFromObjectPath(mediaFileXml, 'nodeValue'))
  this.apiFramework = getFromObjectPath(mediaFileXml, '@apiFramework')
  this.type = getFromObjectPath(mediaFileXml, '@type')
  this.width = getIntegerFromObjectPath(mediaFileXml, '@width')
  this.height = getIntegerFromObjectPath(mediaFileXml, '@height')
  this.delivery = getFromObjectPath(mediaFileXml, '@delivery')
  this.bitrate = getIntegerFromObjectPath(mediaFileXml, '@bitrate')
}

VastMediaFile.prototype.isMP4 = function () {
  return this.delivery === 'progressive' && this.type === 'video/mp4'
}

VastMediaFile.prototype.isFlashVPAID = function () {
  return this.apiFramework === 'VPAID' && this.type === 'application/x-shockwave-flash'
}

VastMediaFile.prototype.isJavascriptVPAID = function () {
  return this.apiFramework === 'VPAID' && this.type === 'application/javascript'
}

export default VastMediaFile

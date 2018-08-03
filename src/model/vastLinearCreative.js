import { getArrayFromObjectPath, getFromObjectPath } from '../util/objectUtil'
import helpers from '../util/helpers'
import VastMediaFile from '../model/vastMediaFile'
import VastIcon from '../model/vastIcon'

function nonEmptyString (trackingObject) {
  return helpers.isNonEmptyString(trackingObject.nodeValue)
}

export default function VastLinearCreative (vastResponse) {
  this.vastResponse = vastResponse
  this.linearInline = getFromObjectPath(this.vastResponse, 'inline.VAST.Ad.InLine.Creatives.Creative.Linear')
  this.linearWrappers = getArrayFromObjectPath(this.vastResponse, 'wrappers.VAST.Ad.Wrapper.Creatives.Creative.Linear')
}

VastLinearCreative.prototype.getDuration = function getDuration (getSecondsFromTimeString = helpers.getSecondsFromTimeString) {
  var stringTime = getFromObjectPath(this.linearInline, 'Duration.nodeValue')
  return getSecondsFromTimeString(stringTime)
}

VastLinearCreative.prototype.getClickTrackers = function getClickTrackers (clickTrackerId) {
  var wrapperClickTracking = getArrayFromObjectPath(this.linearWrappers, 'VideoClicks.ClickTracking')

  var inlineClickTracking = getArrayFromObjectPath(this.linearInline, 'VideoClicks.ClickTracking')

  var allClickTracking = inlineClickTracking.concat(wrapperClickTracking)

  return allClickTracking
    .filter(nonEmptyString)
    .filter(function (trackingObject) {
      if (typeof trackingObject['@id'] === 'undefined') {
        return true
      }

      return clickTrackerId ? trackingObject['@id'] === clickTrackerId : true
    })
    .map(function (trackingObject) {
      return helpers.convertProtocol(trackingObject.nodeValue)
    })
}

VastLinearCreative.prototype.getAllClickTrackersAsMap = function getAllClickTrackersAsMap () {
  var wrapperClickTracking = getArrayFromObjectPath(this.linearWrappers, 'VideoClicks.ClickTracking')

  var inlineClickTracking = getArrayFromObjectPath(this.linearInline, 'VideoClicks.ClickTracking')

  var allClickTracking = inlineClickTracking.concat(wrapperClickTracking)

  var defaultID = 'unknown'

  function byID (trackersMap, trackingObject) {
    var id = trackingObject['@id'] || defaultID
    var url = helpers.convertProtocol(trackingObject.nodeValue)
    var group = trackersMap[id] || []

    group = group.concat([url])
    trackersMap[id] = group
    return trackersMap
  }

  return allClickTracking
    .filter(nonEmptyString)
    .reduce(byID, {})
}

VastLinearCreative.prototype.getClickThrough = function getClickThrough () {
  return getFromObjectPath(this.linearInline, 'VideoClicks.ClickThrough.nodeValue')
}

VastLinearCreative.prototype.getTrackingEvents = function getTrackingEvents (eventName) {
  function getAllTrackingEvents () {
    return getArrayFromObjectPath(this.linearInline, 'TrackingEvents.Tracking')
      .concat(getArrayFromObjectPath(this.linearWrappers, 'TrackingEvents.Tracking'))
  }

  this.trackingEvents = this.trackingEvents || getAllTrackingEvents.call(this)

  return this.trackingEvents
    .filter(function (trackingObject) {
      return trackingObject['@event'] === eventName && helpers.isNonEmptyString(trackingObject.nodeValue)
    })
    .map(function (trackingObject) {
      return helpers.convertProtocol(trackingObject.nodeValue)
    })
}

VastLinearCreative.prototype.getAdParameters = function getAdParameters () {
  var adParameters = getFromObjectPath(this.linearInline, 'AdParameters.nodeValue')

  var xmlEncoded = getFromObjectPath(this.linearInline, 'AdParameters.@xmlEncoded')

  if (xmlEncoded === 'true' && typeof adParameters === 'string') {
    adParameters = helpers.decodeXML(adParameters)
  }

  return adParameters
}

VastLinearCreative.prototype.getIcons = function getIcons () {
  var createIcon = function (iconJSXml) {
    return new VastIcon(iconJSXml)
  }

  var hasValidProgram = function (icon) {
    return icon.program && icon.program !== 'unknown'
  }

  var chooseClosestProgram = function (programDict, icon) {
    programDict[icon.program] = icon
    return programDict
  }

  return getArrayFromObjectPath(this.linearWrappers, 'Icons.Icon')
    .concat(getArrayFromObjectPath(this.linearInline, 'Icons.Icon'))
    .map(createIcon)
    .filter(hasValidProgram)
    .reduce(chooseClosestProgram, {})
}

VastLinearCreative.prototype.getMediaFiles = function getMediaFiles (filter) {
  var mediaFiles = getArrayFromObjectPath(this.linearInline, 'MediaFiles.MediaFile')

  filter = filter || {}

  mediaFiles = mediaFiles.map(function (vastMediaFileXml) {
    return new VastMediaFile(vastMediaFileXml)
  })

  mediaFiles = mediaFiles.filter(function (vastMediaFileXml) {
    var property

    var matchesFilter = true

    for (property in filter) {
      if (filter.hasOwnProperty(property)) {
        matchesFilter = matchesFilter && vastMediaFileXml[property] === filter[property]
      }
    }

    return matchesFilter
  })

  return mediaFiles
}

VastLinearCreative.prototype.getFlashVPAIDMediaFiles = function getFlashVPAIDMediaFiles () {
  return this.getMediaFiles({
    apiFramework: 'VPAID',
    type: 'application/x-shockwave-flash'
  })
}

VastLinearCreative.prototype.getJavascriptVPAIDMediaFiles = function getJavascriptVPAIDMediaFiles () {
  return this.getMediaFiles({
    apiFramework: 'VPAID',
    type: 'application/javascript'
  })
}

VastLinearCreative.prototype.getMp4MediaFiles = function getMp4MediaFiles () {
  return this.getMediaFiles({
    type: 'video/mp4',
    delivery: 'progressive'
  })
}

VastLinearCreative.prototype.hasFlashVPAID = function hasFlashVPAID () {
  return this.getFlashVPAIDMediaFiles().length > 0
}

VastLinearCreative.prototype.hasJavascriptVPAID = function hasJavascriptVPAID () {
  return this.getJavascriptVPAIDMediaFiles().length > 0
}

VastLinearCreative.prototype.hasMp4 = function hasMp4 () {
  return this.getMp4MediaFiles().length > 0
}

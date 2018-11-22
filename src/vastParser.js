import xmlParser from './xmlParser'

function mustBeArray (item) {
  if (
    item === undefined ||
        // Because Object.keys(new Date()).length === 0 we have to do some additional check
        (typeof item === 'object' && Object.keys(item).length === 0 && item.constructor === Object) ||
        item === null ||
        (typeof item === 'number' && item !== 0 && !item)
  ) {
    return []
  }

  return Array.isArray(item) ? item : [item]
}

function ensureArrays (vastInnerObject) {
  if (vastInnerObject.Creatives) {
    vastInnerObject.Creatives.Creative = mustBeArray(vastInnerObject.Creatives.Creative)
  }

  if (vastInnerObject.Extensions) {
    vastInnerObject.Extensions.Extension = mustBeArray(vastInnerObject.Extensions.Extension)
  }

  vastInnerObject.Impression = mustBeArray(vastInnerObject.Impression)
}

function ensureArraysOnCreatives (vastInnerObject) {
  var creative = vastInnerObject.Creatives.Creative

  var nonLinearCreatives = creative.filter(function (item) { return item.NonLinearAds && item.NonLinearAds.NonLinear })

  var linearCreatives = creative.filter(function (item) { return item.Linear })

  nonLinearCreatives.forEach(function (creative) {
    creative.NonLinearAds.NonLinear.NonLinearClickTracking = mustBeArray(creative.NonLinearAds.NonLinear.NonLinearClickTracking)
  })

  linearCreatives.forEach(function (creative) {
    if (creative.Linear.MediaFiles) {
      creative.Linear.MediaFiles.MediaFile = mustBeArray(creative.Linear.MediaFiles.MediaFile)
    }
  })
}

function parse (xmlDocument) {
  var parsedXml = xmlParser.parse(xmlDocument)

  if (!parsedXml.VAST || !parsedXml.VAST.Ad) {
    return parsedXml
  }

  if (Array.isArray(parsedXml.VAST.Ad)) {
    parsedXml.VAST.Ad = parsedXml.VAST.Ad[0]
  }

  if (parsedXml.VAST.Ad.Wrapper) {
    ensureArrays(parsedXml.VAST.Ad.Wrapper)
    if (parsedXml.VAST.Ad.Wrapper.Creatives) {
      ensureArraysOnCreatives(parsedXml.VAST.Ad.Wrapper)
    }
  } else if (parsedXml.VAST.Ad.InLine) {
    ensureArrays(parsedXml.VAST.Ad.InLine)
    ensureArraysOnCreatives(parsedXml.VAST.Ad.InLine)
  }

  return parsedXml
}

export default {
  parse: parse
}

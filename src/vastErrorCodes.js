export default {
  XML_PARSE_ERROR: {
    code: 100,
    message: 'XML parsing error.'
  },
  VAST_SCHEMA_ERROR: {
    code: 101,
    message: 'VAST schema validation error.'
  },
  GENERAL_WRAPPER_ERROR: {
    code: 300,
    message: 'General Wrapper error.'
  },
  WRAPPER_URI_TIMEOUT: {
    code: 301,
    message: 'Timeout of VAST URI provided in Wrapper element,' +
                 ' or of VAST URI provided in a subsequent Wrapper element.' +
                 ' (URI was either unavailable or reached a timeout as defined by the video player.)'
  },
  NO_ADS: {
    code: 303,
    message: 'No Ads VAST response after one or more Wrappers.'
  },
  NO_AD_AT_URI: {
    code: 401,
    message: 'File not found. Unable to find Linear/MediaFile from URI.'
  },
  UNDEFINED_ERROR: {
    code: 900,
    message: 'Undefined Error.'
  }
}

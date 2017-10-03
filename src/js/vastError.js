const vastErrorCodes = require('./vastErrorCodes');
const objectUtil = require('./util/objectUtil');

var read = objectUtil.getArrayFromObjectPath;
var pluckNodeValue = objectUtil.pluckNodeValue;
var isDefined = objectUtil.isDefined;
var flatten = objectUtil.flatten;

function getErrorMessageFromCode(code) {
    var errorName,
        error;

    for (errorName in vastErrorCodes) {
        if (vastErrorCodes.hasOwnProperty(errorName)) {
            error = vastErrorCodes[errorName];

            if (error.code === code) {
                return error.message;
            }
        }
    }

    return 'Unknown error code';
}

function extractErrorURIs(vastResponse) {
    var errorURIs = [],
        wrapperErrorArrays;

    if (vastResponse) {
        wrapperErrorArrays = read(vastResponse, 'wrappers').map(function getWrapperErrors(wrapper) {
            return []
                .concat(read(wrapper, 'VAST.Error'))
                .concat(read(wrapper, 'VAST.Ad.Wrapper.Error'));
        });

        errorURIs = flatten(wrapperErrorArrays)
            .concat(read(vastResponse, 'inline.VAST.Error'))
            .concat(read(vastResponse, 'inline.VAST.Ad.InLine.Error'))
            .map(pluckNodeValue)
            .filter(isDefined);
    }

    return errorURIs;
}

function VastError(code, vastResponse, message) {
    this.name = 'VastError';
    this.code = code;
    this.message = 'VAST Error: [' + code + '] - ' + (message || getErrorMessageFromCode(code));
    this.stack = (new Error()).stack;
    this.errorURIs = extractErrorURIs(vastResponse);
    this.vastResponse = vastResponse;
    }

    VastError.prototype = new Error();
    VastError.prototype.constructor = VastError;

    VastError.prototype.getErrorURIs = function() {
    return this.errorURIs;
};

module.exports = VastError;
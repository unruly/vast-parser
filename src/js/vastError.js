define(['./vastErrorCodes', './util/objectUtil'], function (vastErrorCodes, objectUtil) {
    var read = objectUtil.getArrayFromObjectPath,
        pluckNodeValue = objectUtil.pluckNodeValue,
        isDefined = objectUtil.isDefined;

    function flatten(array) {
        return [].concat.apply(this, array);
    }

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

    function VastError(code, message, vastResponse) {
        this.name = 'VastError';
        this.code = code;
        this.message = "VAST Error: [" + code + "] - " + (message || getErrorMessageFromCode(code));
        this.stack = (new Error()).stack;
        this.errorURIs = extractErrorURIs(vastResponse);
        this.vastResponse = vastResponse;
    }

    VastError.prototype = Object.create(Error.prototype);
    VastError.prototype.constructor = VastError;

    VastError.prototype.getErrorURIs = function() {
        return this.errorURIs;
    };

    return VastError;
});
define(['vastErrorCodes'], function (vastErrorCodes) {

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

    function VastError(code, message) {
        this.name = 'VastError';
        this.code = code;
        this.message = "VAST Error: [" + code + "] - " + (message || getErrorMessageFromCode(code));
        this.stack = (new Error()).stack;
    }
    VastError.prototype = Object.create(Error.prototype);
    VastError.prototype.constructor = VastError;

    return VastError;
});
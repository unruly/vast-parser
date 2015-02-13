define(['./vastErrorCodes'], function (vastErrorCodes) {

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

    function getArrayFromObjectPath(object, path) {
        var pathSections = path.split('.'),
            head,
            tail;

        if (pathSections.length === 1) {
            return object[path] || [];
        }

        head = pathSections[0];

        var next = object[head];
        if (! next) {
            return [];
        }

        tail = pathSections.slice(1).join('.');

        return getArrayFromObjectPath(next, tail);
    }

    function extractErrorURIs(vastChain) {
        var errorURIs = [];

        var addErrorUri = function(error) {
            if (!error.nodeValue){
                return;
            }
            errorURIs.push(error.nodeValue);
        };
        if (vastChain) {
            if (vastChain.wrappers) {
                vastChain.wrappers.forEach(function(wrapper) {
                    getArrayFromObjectPath(wrapper, 'VAST.Error').forEach(addErrorUri);
                    getArrayFromObjectPath(wrapper, 'VAST.Ad.Wrapper.Error').forEach(addErrorUri);
                });
            }
            if(vastChain.inline) {
                getArrayFromObjectPath(vastChain.inline, 'VAST.Error').forEach(addErrorUri);
                getArrayFromObjectPath(vastChain.inline, 'VAST.Ad.InLine.Error').forEach(addErrorUri);
            }
        }

        return errorURIs;
    }

    function VastError(code, message, vastChain) {
        this.name = 'VastError';
        this.code = code;
        this.message = "VAST Error: [" + code + "] - " + (message || getErrorMessageFromCode(code));
        this.stack = (new Error()).stack;
        this.errorURIs = extractErrorURIs(vastChain);
    }

    VastError.prototype = Object.create(Error.prototype);
    VastError.prototype.constructor = VastError;

    VastError.prototype.getErrorURIs = function() {
        return this.errorURIs;
    };

    return VastError;
});
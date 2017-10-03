const objectUtil = require('../util/objectUtil');

function VastExtension(extensionNodes) {
    this.extension = extensionNodes;
}

VastExtension.prototype.getExtensionNodes = function() {
    return this.extension;
};

VastExtension.prototype.getDetailsByPath = function (path) {
    return objectUtil.getArrayFromObjectPath(this.extension, path);
};

module.exports = VastExtension;
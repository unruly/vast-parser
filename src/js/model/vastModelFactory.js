const VastExtension = require('./vastExtension');

module.exports = {
    createVastExtension: function(extensionNodes) {
        return new VastExtension(extensionNodes);
    }
};
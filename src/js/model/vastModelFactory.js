define(['./vastExtension'], function(VastExtension) {
    return {
        createVastExtension: function(extensionNodes) {
            return new VastExtension(extensionNodes);
        }
    }
});
define(['./vastChainer'], function(vastChainer) {

    return {
        requestVastChain: vastChainer.getVastChain,
        addEventListener: vastChainer.addEventListener
    };
});
define(['./vastChainer', 'q', './model/vastResponse', './vastError'], function(vastChainer, Q, VastResponse, VastError) {

    function requestVastChain(url){
        return vastChainer.getVastChain(url).then(function(vastChain) {
            return new VastResponse(vastChain);
        });
    }

    return {
        requestVastChain: requestVastChain,
        addEventListener: vastChainer.addEventListener
    };
});
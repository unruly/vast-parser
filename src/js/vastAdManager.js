define(['./vastChainer', 'q', './model/vastResponse', './vastError'], function(VASTChainer, Q, VastResponse, VastError) {

    function requestVastChain(url){
        return VASTChainer.getVastChain(url).then(function(vastChain) {
            return new VastResponse(vastChain);
        });
    }

    return {
        requestVastChain: requestVastChain
    };
});
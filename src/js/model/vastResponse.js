define([], function() {

    function VastResponse(vastChain) {
        this.wrappers = vastChain.wrappers;
        this.inline = vastChain.inline;
    }

    return VastResponse;

});

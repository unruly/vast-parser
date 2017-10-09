const vastChainer = require('./vastChainer');

module.exports = function(chainer = vastChainer()) {
    return {
        requestVastChain: chainer.getVastChain,
        addEventListener: chainer.addEventListener
    }
}
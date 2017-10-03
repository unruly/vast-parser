const vastChainer = require('./vastChainer');

module.exports = (chainer = vastChainer) => ({
    requestVastChain: chainer.getVastChain,
    addEventListener: chainer.addEventListener
});
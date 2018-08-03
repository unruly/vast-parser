import vastChainer from './vastChainer'

export default function (chainer = vastChainer()) {
  return {
    requestVastChain: chainer.getVastChain,
    addEventListener: chainer.addEventListener
  }
}

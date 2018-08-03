import VastExtension from './vastExtension'

export default {
  createVastExtension: function (extensionNodes) {
    return new VastExtension(extensionNodes)
  }
}

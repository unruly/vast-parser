import { getArrayFromObjectPath } from '../util/objectUtil'

export default function VastExtension (extensionNodes) {
  this.extension = extensionNodes
}

VastExtension.prototype.getExtensionNodes = function () {
  return this.extension
}

VastExtension.prototype.getDetailsByPath = function (path) {
  return getArrayFromObjectPath(this.extension, path)
}

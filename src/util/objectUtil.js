export function isDefined (element) {
  return typeof element !== 'undefined' && element !== null
}

export function flatten (array) {
  return [].concat.apply([], array)
}

export function getArrayFromObjectPath (object, path) {
  var pathSections = path.split('.')

  var head

  var tail

  var next

  var defaultValue = []

  if (object instanceof Array) {
    return flatten(object.map(function (nextItem) {
      return getArrayFromObjectPath(nextItem, path)
    }))
  }

  object = object || defaultValue

  if (pathSections.length === 1) {
    var item = object[path]

    if (!isDefined(item)) {
      return defaultValue
    }

    if (!(item instanceof Array)) {
      item = [item]
    }

    return item
  }

  head = pathSections[0]
  tail = pathSections.slice(1).join('.')
  next = object[head]

  if (!isDefined(next)) {
    return defaultValue
  }

  return getArrayFromObjectPath(next, tail)
}

export function getFromObjectPath (object, path, defaultValue) {
  var results = getArrayFromObjectPath(object, path)

  if (!isDefined(results[0])) {
    return defaultValue
  }

  return results[0]
}

export function getIntegerFromObjectPath (object, path, defaultValue) {
  var value = getFromObjectPath(object, path, defaultValue)

  value = parseInt(value, 10)

  if (isNaN(value)) {
    return defaultValue
  } else {
    return value
  }
}

export function pluckNodeValue (element) {
  if (!element) {
    return
  }
  return element.nodeValue
}

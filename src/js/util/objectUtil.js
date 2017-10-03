function isDefined(element) {
    return typeof element !== 'undefined' && element !== null;
}

function flatten(array) {
    return [].concat.apply([], array);
}

function getArrayFromObjectPath(object, path) {
    var pathSections = path.split('.'),
        head,
        tail,
        next,
        defaultValue = [];

    if(object instanceof Array) {
        return flatten(object.map(function(nextItem) {
            return getArrayFromObjectPath(nextItem, path);
        }));
    }

    object = object || defaultValue;

    if (pathSections.length === 1) {
        var item = object[path];

        if (!isDefined(item)) {
            return defaultValue;
        }

        if (!(item instanceof Array)) {
            item = [item];
        }

        return item;
    }

    head = pathSections[0];
    tail = pathSections.slice(1).join('.');
    next = object[head];

    if (!isDefined(next)) {
        return defaultValue;
    }

    return getArrayFromObjectPath(next, tail);
}

function getFromObjectPath(object, path, defaultValue) {
    var results = getArrayFromObjectPath(object, path);

    if (!isDefined(results[0])) {
        return defaultValue;
    }

    return results[0];
}

function getIntegerFromObjectPath(object, path, defaultValue) {
    var value = getFromObjectPath(object, path, defaultValue);

    value = parseInt(value, 10);

    if (isNaN(value)) {
        return defaultValue;
    } else {
        return value;
    }
}

function pluckNodeValue(element) {
    if(!element) {
        return;
    }
    return element.nodeValue;
}

module.exports = {
    getArrayFromObjectPath: getArrayFromObjectPath,
    getIntegerFromObjectPath: getIntegerFromObjectPath,
    getFromObjectPath: getFromObjectPath,
    pluckNodeValue: pluckNodeValue,
    isDefined: isDefined,
    flatten: flatten
};
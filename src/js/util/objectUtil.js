define([], function() {
    function getArrayFromObjectPath(object, path) {
        return getFromObjectPath(object, path, []);
    }

    function getFromObjectPath(object, path, defaultValue) {
        var pathSections = path.split('.'),
            head,
            tail;

        object = object || defaultValue;

        if (pathSections.length === 1) {
            return object[path] || defaultValue;
        }

        head = pathSections[0];

        var next = object[head];
        if (! next) {
            return defaultValue;
        }

        tail = pathSections.slice(1).join('.');

        return getArrayFromObjectPath(next, tail, defaultValue);
    }

    function pluckNodeValue(element) {
        return element.nodeValue;
    }

    function isDefined(element) {
        return typeof element !== 'undefined' && element !== null;
    }

    return {
        getArrayFromObjectPath: getArrayFromObjectPath,
        getFromObjectPath: getFromObjectPath,
        pluckNodeValue: pluckNodeValue,
        isDefined: isDefined
    };
});
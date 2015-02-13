define([], function() {
    function getArrayFromObjectPath(object, path) {
        return getFromObjectPath(object, path, []);
    }

    function getFromObjectPath(object, path, defaultValue) {
        var pathSections = path.split('.'),
            head,
            tail;

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

    return {
        getArrayFromObjectPath: getArrayFromObjectPath,
        getFromObjectPath: getFromObjectPath
    };
});
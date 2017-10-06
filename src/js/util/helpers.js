function getSecondsFromTimeString(timeString) {
    var durationInSeconds = 0,
        timeSegments;

    if(typeof timeString !== 'string') {
        return;
    }

    timeSegments = timeString.split(':');

    if(timeSegments.length !== 3) {
        return;
    }

    timeSegments.forEach(function(timeSegment, i) {
        durationInSeconds += (parseFloat(timeSegment, 10) * Math.pow(60, 2 - i));
    });

    return durationInSeconds;
}

function decodeXML(encodedXMLString) {
    return encodedXMLString.replace(/&apos;/g, '\'')
                            .replace(/&quot;/g, '"')
                            .replace(/&gt;/g, '>')
                            .replace(/&lt;/g, '<')
                            .replace(/&amp;/g, '&');
}

function convertProtocol(url) {
    if(url.indexOf('https') === 0) {
        return url;
    } else if(url.indexOf('http') === 0) {
        return url.substr(5);
    } else {
        return url;
    }
}

function ensureProtocol(url) {
    if(url.indexOf('https') === 0 || url.indexOf('http') === 0) {
        return url
    } else if(url.indexOf('//') === 0) {
        return `https:${url}`;
    } else {
        return url;
    }
}

function isNonEmptyString(string) {
    return !!string && string.trim().length > 0;
}

module.exports = {
    getSecondsFromTimeString: getSecondsFromTimeString,
    decodeXML: decodeXML,
    ensureProtocol: ensureProtocol,
    convertProtocol: convertProtocol,
    isNonEmptyString: isNonEmptyString
};
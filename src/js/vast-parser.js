define(['./xml-parser'], function(xmlParser) {

    function mustBeArray(item) {
        if(item === undefined || item === null || (typeof item === 'number' && item !==0 && !item)) {
            return [];
        }

        if(!Array.isArray(item)) {
            return [item];
        }
        return item;
    }

    function parse(xmlDocument) {
        var parsedXml = xmlParser.parse(xmlDocument);

        if (!!parsedXml.VAST && !!parsedXml.VAST.Ad) {
            if (!!parsedXml.VAST.Ad.InLine) {
                parsedXml.VAST.Ad.InLine.Creatives.Creative = mustBeArray(parsedXml.VAST.Ad.InLine.Creatives.Creative);
            } else if (!!parsedXml.VAST.Ad.Wrapper) {
                parsedXml.VAST.Ad.Wrapper.Creatives.Creative = mustBeArray(parsedXml.VAST.Ad.Wrapper.Creatives.Creative);
            } /*else {

             }*/
        }

        return parsedXml;
    }

    return {
        parse: parse
    };
});
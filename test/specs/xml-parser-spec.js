describe('XML Parser', function(){

    var xmlParser;

    function loadTestXML(filename, test) {
        requirejs(['text!../../test/resources/xml/' + filename], function(xmlString) {
            var parser = new DOMParser(),
                xmlDocument = parser.parseFromString(xmlString, 'application/xml');

            if (typeof xmlDocument.evaluate !== 'function') {
                xmlDocument = new ActiveXObject('msxml2.DOMDocument');
                xmlDocument.loadXML(xmlString);
                xmlDocument.setProperty('SelectionLanguage', 'XPath');
            }

            test(xmlDocument);
        });
    }

    before(function(done) {
        requirejs(['Squire'], function(Squire) {
            new Squire()
                .require(['xml-parser'], function(xmlParserModule) {
                    xmlParser = xmlParserModule;
                    done();
                });

        });
    });

    describe('Basic XML parsing', function() {

        function testWithSimpleXmlDocument(test) {
            loadTestXML('xml_plain_vanilla.xml', test);
        }

        it('parses a simple XML document', function(done) {
            testWithSimpleXmlDocument(function(xmlDocument) {
                var parsedXml = xmlParser.parse(xmlDocument);
                expect(parsedXml.cornetto).not.to.be.undefined;
                done();
            });
        });

        it('parses the attributes of a node', function(done) {
            testWithSimpleXmlDocument(function(xmlDocument) {
                var parsedXml = xmlParser.parse(xmlDocument);
                expect(parsedXml.cornetto.highlander['@bar']).to.equal('baz');
                done();
            });
        });

        it('parses CDATA contents of node', function(done) {
            testWithSimpleXmlDocument(function(xmlDocument) {
                var parsedXml = xmlParser.parse(xmlDocument);
                expect(parsedXml.cornetto.groot.nodeValue).to.equal('i am groot');
                done();
            });
        });

    });

});

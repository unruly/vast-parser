const xmlParser = require('../../src/js/xmlParser');
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;

describe('XML Parser', function(){

    function loadTestXML(filename, test) {
        fs.readFile('test/resources/xml/' + filename, 'utf8', function (err,xmlString) {
          if (err) {
            throw err;
          }

          var parser = new DOMParser(),
              xmlDocument = parser.parseFromString(xmlString, 'text/xml');

          test(xmlDocument);
        });
    }

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
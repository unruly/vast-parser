describe('VAST Media File', function() {

    var VastMediaFile;

    beforeEach(function(done) {
        requirejs(['model/vastMediaFile'], function(VastMediaFileClass) {
            VastMediaFile = VastMediaFileClass;

            done();
        });
    });

    describe('url property', function() {
        it('should return URL from MediaFile', function() {
            var mediaFile,
                xmlData = {
                    nodeValue: 'videoFile'
                };

            mediaFile = new VastMediaFile(xmlData);

            expect(mediaFile.url).to.equal('videoFile');
        });
    });

    describe('apiFramework property', function() {
        it('should return apiFramework from MediaFile', function() {
            var mediaFile,
                xmlData = {
                    nodeValue: 'videoFile',
                    '@apiFramework': 'VPAID'
                };

            mediaFile = new VastMediaFile(xmlData);

            expect(mediaFile.apiFramework).to.equal('VPAID');
        });

        it('should return apiFramework as undefined when not present on MediaFile', function() {
            var mediaFile,
                xmlData = {
                    nodeValue: 'videoFile'
                };

            mediaFile = new VastMediaFile(xmlData);

            expect(mediaFile.apiFramework).to.be.undefined;
        });
    });

    describe('type property', function() {
        it('should return type from MediaFile', function() {
            var mediaFile,
                xmlData = {
                    nodeValue: 'videoFile',
                    '@type': 'application/x-shockwave-flash'
                };

            mediaFile = new VastMediaFile(xmlData);

            expect(mediaFile.type).to.equal('application/x-shockwave-flash');
        });

        it('should return type as undefined when not present on MediaFile', function() {
            var mediaFile,
                xmlData = {
                    nodeValue: 'videoFile'
                };

            mediaFile = new VastMediaFile(xmlData);

            expect(mediaFile.type).to.be.undefined;
        });
    });

    describe('width property', function() {
        it('should return width from MediaFile', function() {
            var mediaFile,
                xmlData = {
                    nodeValue: 'videoFile',
                    '@width': '300'
                };

            mediaFile = new VastMediaFile(xmlData);

            expect(mediaFile.width).to.equal('300');
        });

        it('should return width as undefined when not present on MediaFile', function() {
            var mediaFile,
                xmlData = {
                    nodeValue: 'videoFile'
                };

            mediaFile = new VastMediaFile(xmlData);

            expect(mediaFile.width).to.be.undefined;
        });
    });

    describe('height property', function() {
        it('should return height from MediaFile', function() {
            var mediaFile,
                xmlData = {
                    nodeValue: 'videoFile',
                    '@height': '200'
                };

            mediaFile = new VastMediaFile(xmlData);

            expect(mediaFile.height).to.equal('200');
        });

        it('should return height as undefined when not present on MediaFile', function() {
            var mediaFile,
                xmlData = {
                    nodeValue: 'videoFile'
                };

            mediaFile = new VastMediaFile(xmlData);

            expect(mediaFile.height).to.be.undefined;
        });
    });

    describe('delivery property', function() {
        it('should return delivery from MediaFile', function() {
            var mediaFile,
                xmlData = {
                    nodeValue: 'videoFile',
                    '@delivery': 'progressive'
                };

            mediaFile = new VastMediaFile(xmlData);

            expect(mediaFile.delivery).to.equal('progressive');
        });

        it('should return delivery as undefined when not present on MediaFile', function() {
            var mediaFile,
                xmlData = {
                    nodeValue: 'videoFile'
                };

            mediaFile = new VastMediaFile(xmlData);

            expect(mediaFile.delivery).to.be.undefined;
        });
    });

    describe('bitrate property', function() {
        it('should return bitrate from MediaFile', function() {
            var mediaFile,
                xmlData = {
                    nodeValue: 'videoFile',
                    '@bitrate': '600'
                };

            mediaFile = new VastMediaFile(xmlData);

            expect(mediaFile.bitrate).to.equal('600');
        });

        it('should return bitrate as undefined when not present on MediaFile', function() {
            var mediaFile,
                xmlData = {
                    nodeValue: 'videoFile'
                };

            mediaFile = new VastMediaFile(xmlData);

            expect(mediaFile.bitrate).to.be.undefined;
        });
    });
});

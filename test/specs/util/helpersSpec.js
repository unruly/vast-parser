describe('Helpers Util', function() {

    var helpers;

    beforeEach(function(done) {
        requirejs(['Squire'], function(Squire) {
            var injector = new Squire();
            injector.require(['util/helpers'], function(module) {
                helpers = module;
                done();
            });
        });
    });

    describe('time converter', function() {
        it('should convert 00:00:00 time into seconds', function() {
            expect(helpers.getSecondsFromTimeString('00:00:00')).to.equal(0);
        });

        it('should convert 00:00:10 time into seconds', function() {
            expect(helpers.getSecondsFromTimeString('00:00:10')).to.equal(10);
        });

        it('should convert 00:03:10 time into seconds', function() {
            expect(helpers.getSecondsFromTimeString('00:03:10')).to.equal(190);
        });

        it('should convert 01:00:10 time into seconds', function() {
            expect(helpers.getSecondsFromTimeString('01:00:10')).to.equal(3610);
        });

        it('should convert 01:00:10.3 time into seconds', function() {
            expect(helpers.getSecondsFromTimeString('01:00:10.3')).to.equal(3610.3);
        });

        it('should convert 01:00:10.123 time into seconds', function() {
            expect(helpers.getSecondsFromTimeString('01:00:10.123')).to.equal(3610.123);
        });

        it('should return undefined if time is invalid(empty string)', function() {
            expect(helpers.getSecondsFromTimeString('')).to.be.undefined;
        });

        it('should return undefined if time is invalid(hours is float)', function() {
            expect(helpers.getSecondsFromTimeString('12.42:23:10')).to.be.undefined;
        });

        it('should return undefined if time is invalid(not valid vast format)', function() {
            expect(helpers.getSecondsFromTimeString('12:23')).to.be.undefined;
        });

        it('should return undefined if time is in invalid(contains letters)', function() {
            expect(helpers.getSecondsFromTimeString('12:23:12a')).to.be.undefined;
        });

        it('should return undefined if time undefined', function() {
            expect(helpers.getSecondsFromTimeString(undefined)).to.be.undefined;
        });
    });

    describe('decodeXML', function() {
        it('should decode &apos; to \'', function() {
          expect(helpers.decodeXML('&apos;')).to.equal('\'')
        });

        it('should decode &quot; to "', function() {
            expect(helpers.decodeXML('&quot;')).to.equal('"')
        });

        it('should decode &gt; to >', function() {
            expect(helpers.decodeXML('&gt;')).to.equal('>')
        });

        it('should decode &lt; to <', function() {
            expect(helpers.decodeXML('&lt;')).to.equal('<')
        });

        it('should decode &amp; to &', function() {
            expect(helpers.decodeXML('&amp;')).to.equal('&')
        });
    });
});
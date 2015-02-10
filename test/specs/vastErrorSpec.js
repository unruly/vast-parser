describe('VAST Error', function() {
    var Q,
        VastError;

    beforeEach(function(done) {
        requirejs(['Squire'], function(Squire) {
            var injector = new Squire();

            injector.require(['q', 'vastError'], function(q, vastErrorClass) {
                Q = q;
                VastError = vastErrorClass;

                done();
            });
        });
    });

    it('should be possible to get the code', function () {
        expect(new VastError(101).code).to.equal(101);
    });

    describe('message', function () {
        it('should be parsing error for 100', function () {
            expect(new VastError(100).message).to.contain("XML parsing error.");
        });

        it('should be wrapper error for 300', function () {
            expect(new VastError(300).message).to.contain("General Wrapper error.");
        });

        it('should be unknown error code for 999999', function () {
            expect(new VastError(999999).message).to.contain("Unknown error code");
        });

        it('should be our own error message when supplied to VastError', function () {
            var vastError = new VastError(300, 'My Error Message');
            expect(vastError.message).to.contain("My Error Message");
            expect(vastError.message).to.contain("300");
        });
    });

    describe('working with chai', function () {
        it("should be possible check the type only", function () {
            var deferred = Q.defer(),
                promise = deferred.promise;

            deferred.reject(new VastError(300));

            return expect(promise).to.be.rejectedWith(VastError);
        });

        it("should be possible check the code", function () {
            var deferred = Q.defer(),
                promise = deferred.promise;

            deferred.reject(new VastError(100));

            return expect(promise).to.be.rejectedWith(VastError, 100);
        });
    });

});

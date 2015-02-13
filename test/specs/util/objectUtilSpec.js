describe('Object Util', function() {

    var objectUtil;

    beforeEach(function(done) {
        requirejs(['Squire'], function(Squire) {
            var injector = new Squire();
            injector.require(['util/objectUtil'], function(module) {
                objectUtil = module;
                done();
            });
        });
    });

    describe('getFromObjectPath', function() {
        it('fetchs a value from inside the nested object', function() {
            var obj = {
                foo: {
                    bar: {
                        minky: 'binky'
                    }
                }
            };

            var result = objectUtil.getFromObjectPath(obj, 'foo.bar.minky');

            expect(result).to.deep.equal(obj.foo.bar.minky);
        });

        it('returns the supplied argument if the path inside the nested objects does not exist', function() {
            var obj = {

            };

            var result = objectUtil.getFromObjectPath(obj, 'foo.does.not.exist', "it's missing!");

            expect(result).to.deep.equal("it's missing!");
        });

    });

    describe('getArrayFromObjectPath', function() {
        it('extracts arrays from inside a nested object', function() {
           var obj = {
               foo: {
                   bar: {
                       minky: ['binky']
                   }
               }
           };

            var result = objectUtil.getArrayFromObjectPath(obj, 'foo.bar.minky');

            expect(result).to.deep.equal(obj.foo.bar.minky);
        });

        it('returns an empty array if the path inside the nested objects does not exist', function() {
            var obj = {

            };

            var result = objectUtil.getArrayFromObjectPath(obj, 'foo.does.not.exist');

            expect(result).to.deep.equal([]);
        });


        it('returns an empty array if only some of path inside the nested objects does not exist', function() {
            var obj = {
                foo: {
                }
            };

            var result = objectUtil.getArrayFromObjectPath(obj, 'foo.does.not.exist');

            expect(result).to.deep.equal([]);
        });

        it('returns an empty array if object is an array', function() {
            var obj = [];

            var result = objectUtil.getArrayFromObjectPath(obj, 'foo.does.not.exist');

            expect(result).to.deep.equal([]);
        });
    });
});
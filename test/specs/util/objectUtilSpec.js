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

        it('returns an empty array if object is null', function() {
            var obj = null;

            var result = objectUtil.getArrayFromObjectPath(obj, 'foo.does.not.exist');

            expect(result).to.deep.equal([]);
        });

        it('returns an empty array if object is undefined', function() {
            var obj = undefined;

            var result = objectUtil.getArrayFromObjectPath(obj, 'foo.does.not.exist');

            expect(result).to.deep.equal([]);
        });
    });

    describe('pluckNodeValue', function() {
        it('returns node value from object', function() {
            var expectedValue = 'I am a value',
                obj = {
                    nodeValue: expectedValue
                };

            var result = objectUtil.pluckNodeValue(obj);

            expect(result).to.equal(expectedValue);
        });

        it('returns undefined if no nodevalue on object', function() {
            var obj = {};

            var result = objectUtil.pluckNodeValue(obj);

            expect(result).to.be.undefined;
        });
    });

    describe('isDefined', function() {
        it('should return true if defined', function() {
            var result = objectUtil.isDefined('working');

            expect(result).to.be.true;
        });

        it('should return false if not defined', function() {
            var result = objectUtil.isDefined(undefined);

            expect(result).to.be.false;
        });

        it('should return false if not defined', function() {
            var result = objectUtil.isDefined(null);

            expect(result).to.be.false;
        });
    });
});
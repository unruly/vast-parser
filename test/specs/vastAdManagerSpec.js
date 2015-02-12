describe('VAST Ad Manager', function() {
    var vastAdManager,
        mockVastChainer,
        VastResponse,
        VastError,
        successResponse = {
            wrappers: [{some:"ignoredForNow"}],
            inline: {complicated: "stuff"}
        },
        Q;


    beforeEach(function(done) {
        requirejs(['Squire'], function(Squire) {
            var injector = new Squire();

            mockVastChainer = {
                getVastChain: sinon.stub(),
                addEventListener: sinon.stub()
            };

            injector
                .store(['q', 'model/vastResponse', 'vastError'])
                .mock('vastChainer', mockVastChainer)
                .require(['vastAdManager', 'mocks'], function(module, mocks) {
                    vastAdManager = module;
                    mockVastChainer.getVastChain.resolves(successResponse);
                    Q = mocks.store['q'];
                    VastError = mocks.store['vastError'];
                    VastResponse = mocks.store['model/vastResponse'];
                    done();
            });
        });
    });

    describe('getVastChain', function() {

        describe('returns resolved promise ', function() {

            beforeEach(function() {
                mockVastChainer.getVastChain.resolves(successResponse);
            });

            it('and calls the vastChainer with VAST URL', function() {
                var vastUrl = 'http://example.com/vast.xml';

                vastAdManager.requestVastChain(vastUrl);

                expect(mockVastChainer.getVastChain).to.have.been.calledWith(vastUrl);
            });

            it('with the vastChainer result', function() {
                var promise;

                promise = vastAdManager.requestVastChain('http://example.com/vast.xml');

                return Q.all([
                    expect(promise).to.eventually.be.an.instanceof(VastResponse),
                    expect(promise).to.eventually.have.property('wrappers').that.deep.equals(successResponse.wrappers),
                    expect(promise).to.eventually.have.property('inline').that.deep.equals(successResponse.inline)
                ]);
            });

        });

        describe('returns rejected promise ', function() {

            it('with the vastChainer error', function() {
                var promise;

                mockVastChainer.getVastChain.rejects(new VastError(100));

                promise = vastAdManager.requestVastChain('http://example.com/vast.xml');

                return expect(promise).to.be.eventually.rejectedWith(VastError, "100");
            });
        });

    });

    describe('adds event handlers', function() {
        it('to the vastChainer', function() {
            var eventCallback = sinon.stub();

            vastAdManager.addEventListener('someEvent', eventCallback);

            expect(mockVastChainer.addEventListener).to.have.been.calledWith('someEvent', eventCallback);
        });
    });

});
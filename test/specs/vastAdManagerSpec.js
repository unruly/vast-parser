import vastAdManager from '../../src/vastAdManager'
import VastResponse from '../../src/model/vastResponse'
import VastError from '../../src/vastError'

describe('VAST Ad Manager', function () {
  var mockVastChainer,
    successResponse

  beforeEach(function () {
    successResponse = new VastResponse({
      wrappers: [{some: 'ignoredForNow'}],
      inline: {complicated: 'stuff'}
    })

    mockVastChainer = {
      getVastChain: sinon.stub().returns(Promise.resolve(successResponse)),
      addEventListener: sinon.stub()
    }
  })

  describe('getVastChain', function () {
    describe('returns resolved promise ', function () {
      beforeEach(function () {
        mockVastChainer.getVastChain.resolves(successResponse)
      })

      it('and calls the vastChainer with VAST URL', function () {
        var vastUrl = 'http://example.com/vast.xml'

        vastAdManager(mockVastChainer).requestVastChain(vastUrl)

        expect(mockVastChainer.getVastChain).to.have.been.calledWith(vastUrl)
      })

      it('with the vastChainer result', function () {
        var promise

        promise = vastAdManager(mockVastChainer).requestVastChain('http://example.com/vast.xml')

        return promise.then(function (result) {
          expect(result).to.be.an.instanceof(VastResponse)
          expect(result).to.have.property('wrappers').that.deep.equals(successResponse.wrappers)
          expect(result).to.have.property('inline').that.deep.equals(successResponse.inline)
        })
      })
    })

    describe('returns rejected promise ', function () {
      it('with the vastChainer error', function () {
        var promise

        mockVastChainer.getVastChain.rejects(new VastError(100))

        promise = vastAdManager(mockVastChainer).requestVastChain('http://example.com/vast.xml')

        return expect(promise).to.be.eventually.rejectedWith(VastError, '100')
      })
    })
  })

  describe('adds event handlers', function () {
    it('to the vastChainer', function () {
      var eventCallback = sinon.stub()

      vastAdManager(mockVastChainer).addEventListener('someEvent', eventCallback)

      expect(mockVastChainer.addEventListener).to.have.been.calledWith('someEvent', eventCallback)
    })
  })
})

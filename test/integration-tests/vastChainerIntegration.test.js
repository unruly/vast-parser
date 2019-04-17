import vastChainer from '../../src/vastChainer'
import VastResponse from '../../src/model/vastResponse'
import VastError from '../../src/vastError'
import { mockMakeJqueryAjaxRequest } from '../mocks/mockMakeJquestAjaxRequest'
import allExpectedVastResponses from './expectedVastResponses'

describe('vastChainer Integration tests', () => {
  describe('vastConfig containing vastUrl', () => {
    it('should return expected VastResponse for `vast_wrapper_with-linear-ad-only` VAST chain', done => {
      const firstVastUrl = 'http://example.com/test/resources/vast/wrappers/vast_wrapper_with-linear-ad-only.xml'
      const mockVastConfig = { url: firstVastUrl }
      const expectedVastResponse = allExpectedVastResponses['vast_wrapper_with-linear-ad-only']

      vastChainer({ makeJqueryAjaxRequest: mockMakeJqueryAjaxRequest })
        .getVastChain(mockVastConfig)
        .then(vastResponse => {
          expect(vastResponse).to.be.an.instanceOf(VastResponse)
          expect(vastResponse).to.have.property('wrappers').that.deep.equals(expectedVastResponse.wrappers)
          expect(vastResponse).to.have.property('inline').that.deep.equals(expectedVastResponse.inline)
          expect(vastResponse).to.have.property('_raw').that.deep.equals(expectedVastResponse._raw)

          done()
        })
    })

    it('should return a VastError if the vast contains no-ads', done => {
      const firstVastUrl = 'http://example.com/test/resources/vast/wrappers/vast_wrapper_no-ads.xml'
      const mockVastConfig = { url: firstVastUrl }
      const expectedVastResponse = allExpectedVastResponses['vast_wrapper_no-ads']

      vastChainer({ makeJqueryAjaxRequest: mockMakeJqueryAjaxRequest })
        .getVastChain(mockVastConfig)
        .catch(vastError => {
          expect(vastError).to.be.an.instanceOf(VastError)
          expect(vastError.code).to.equal(303)
          expect(vastError.message).to.equal('VAST Error: [303] - VAST request returned no ads')

          const { vastResponse } = vastError
          expect(vastResponse).to.be.an.instanceOf(VastResponse)
          expect(vastResponse).to.have.property('wrappers').that.deep.equals(expectedVastResponse.wrappers)
          expect(vastResponse).to.have.property('inline').that.deep.equals(expectedVastResponse.inline)
          expect(vastResponse).to.have.property('_raw').that.deep.equals(expectedVastResponse._raw)

          done()
        })
    })
  })
})

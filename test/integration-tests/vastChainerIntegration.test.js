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

    it('should return a VastError when the next vastUrl inside a wrapper is missing', done => {
      const firstVastUrl = 'http://example.com/test/resources/vast/wrappers/vast_wrapper_with-missing-vast-ad-tag-uri.xml'
      const mockVastConfig = { url: firstVastUrl }
      const expectedVastResponse = allExpectedVastResponses['vast_wrapper_with-missing-vast-ad-tag-uri']

      vastChainer({ makeJqueryAjaxRequest: mockMakeJqueryAjaxRequest })
        .getVastChain(mockVastConfig)
        .catch(vastError => {
          expect(vastError).to.be.an.instanceOf(VastError)
          expect(vastError.code).to.equal(301)
          expect(vastError.message).to.include(
            'Timeout of VAST URI provided in Wrapper element,' +
            ' or of VAST URI provided in a subsequent Wrapper element.' +
            ' (URI was either unavailable or reached a timeout as defined by the video player.)'
          )

          const { vastResponse } = vastError
          expect(vastResponse).to.be.an.instanceOf(VastResponse)
          expect(vastResponse).to.have.property('wrappers').that.deep.equals(expectedVastResponse.wrappers)
          expect(vastResponse).to.have.property('inline').that.deep.equals(expectedVastResponse.inline)
          expect(vastResponse).to.have.property('_raw').that.deep.equals(expectedVastResponse._raw)

          done()
        })
    })
  })

  describe('vastConfig containing vastBody', () => {
    it('should return expected VastResponse for `vast-body-provided-directly` VAST chain', done => {
      const vastBody = '<?xml version="1.0" encoding="UTF-8"?><VAST version="3.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../../vast/vast3_draft.xsd"><Ad id="1" sequence="1"><Wrapper><VASTAdTagURI><![CDATA[http://localhost/test/resources/vast/inlines/test_vast_inline_with-linear-ad.xml]]></VASTAdTagURI></Wrapper></Ad></VAST>'
      const firstVastBody = new window.DOMParser().parseFromString(vastBody, 'application/xml')
      const mockVastConfig = {
        vastBody: firstVastBody,
        vastBodyUrl: '//localhost/getVAST'
      }
      const expectedVastResponse = allExpectedVastResponses['vast-body-provided-directly']

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

    it('should return expected VastResponse for `vast-body-provided-directly-no-ads` VAST chain', done => {
      const vastBody = '<VAST></VAST>'
      const firstVastBody = new window.DOMParser().parseFromString(vastBody, 'application/xml')
      const mockVastConfig = {
        vastBody: firstVastBody,
        vastBodyUrl: '//localhost/getVAST'
      }
      const expectedVastResponse = allExpectedVastResponses['vast-body-provided-directly-no-ads']

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

import fs from 'fs'
import path from 'path'

const getRequestedVastFromUrl = url => {
  const vastPathIndex = url.indexOf('resources/')
  return url.substring(vastPathIndex)
}

const mockJqXHR = {
  status: 200,
  responseText: 'test responseText',
  getAllResponseHeaders: sinon.stub().returns('test headers')
}

export const mockMakeJqueryAjaxRequest = settings => {
  const requestVast = getRequestedVastFromUrl(settings.url)
  const vastPath = path.join(__dirname, '..', requestVast)

  fs.readFile(vastPath, 'utf8', (err, data) => {
    if (err) {
      settings.error(mockJqXHR, 'error test status', err)
    }

    const vastXmlDocument = new window.DOMParser().parseFromString(data, 'application/xml')
    settings.success(vastXmlDocument, 'success test status', mockJqXHR)
  })
}

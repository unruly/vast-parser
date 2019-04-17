/* eslint-env node */
require('babel-core/register')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const chaiAsPromised = require('chai-as-promised')
const url = require('url')

global.sinon = require('sinon')
global.expect = chai.expect
global.fetch = require('node-fetch')

const jsdom = require('jsdom')
const { JSDOM } = jsdom

global.window = new JSDOM('<!doctype html><html><body></body></html>').window
global.document = window.document

global.URL = function (href) {
  return url.parse(href)
}

chai.use(sinonChai)
chai.use(chaiAsPromised)

function useSinonAsPromised (sinon, Promise) {
  var internals = {}

  if (!Promise) {
    throw new Error('A Promise constructor must be provided')
  }

  internals.resolves = function (Promise, value) {
    return this.returns(new Promise(function (resolve) {
      resolve(value)
    }))
  }

  internals.rejects = function (Promise, err) {
    if (typeof err === 'string') {
      err = new Error(err)
    }
    return this.returns(new Promise(function (resolve, reject) {
      reject(err)
    }))
  }

  sinon.stub.resolves = function (value) {
    return internals.resolves.call(this, Promise, value)
  }
  sinon.stub.rejects = function (err) {
    return internals.rejects.call(this, Promise, err)
  }
}

useSinonAsPromised(sinon, Promise)

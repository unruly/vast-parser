# @unruly/vast-parser

[![Travis](https://img.shields.io/travis/unruly/vast-parser.svg)](https://travis-ci.org/unruly/vast-parser)
[![npm](https://img.shields.io/npm/v/@unruly/vast-parser.svg)](https://www.npmjs.com/package/@unruly/vast-parser)

Recursively requests and parses VAST chains into a single JavaScript object.

VAST Chains are VAST Wrappers wrapped in more VAST Wrappers eventually resulting in a VAST Inline.

## Example

```js
import { VastAdManager } from '@unruly/vast-parser'

const vastAdManager = new VastAdManager()
vastAdManager.requestVastChain({ url: 'http://example.com/vast-file.xml' })
  .then(
    vastResponse => {
      // success
    },
    vastError => {
      // failure
    }
  )
```

## Installation

You'll need to use a package manager like npm to install this package.

```bash
# npm
npm install @unruly/vast-parser

# yarn
yarn add @unruly/vast-parser
```

### Notable Dependencies

- [jQuery](https://jquery.com/) for requesting nested VAST URIs. We hope to replace this in the future.

### Polyfills

You may need to include some polyfills depending on your target environment.

- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)

## Usage

Use this package like a typical ES6 module. For detailed usage information on each export, see the subsections below.

```js
// import what you need
import {
  VastAdManager,
  VastErrorCodes,
  VastParser
} from '@unruly/vast-parser'

// do what you want
```

### VastAdManager

#### new VastAdManager(): { requestVastChain, addEventListener }

Creates a `VastAdManager`.

##### vastAdManager.requestVastChain(config: ({ url: string })): Promise<VastResponse>

Recursively requests a given VAST URL until a VAST Inline is reached.

Resolves to a [`VastResponse`](https://github.com/unruly/vast-parser/blob/master/src/model/vastResponse.js).

Rejects to a [`VastError`](https://github.com/unruly/vast-parser/blob/master/src/vastError.js) with a `code` matching to one of the `VastErrorCodes.code` (see `VastErrorCodes` section).

##### vastAdManager.addEventListener(eventName: string, handler: (event: Event) => void): void

Calls the given `handler` when an `event` of the `eventName` is fired. The `handler` is passed the `event` as its first parameter.

**Event Names**

- `requestStart` - start of request for VAST file
- `requestEnd` - end of request for VAST file

**Event Properties**

- `requestNumber` - the current depth of the VAST chain.
- `uri` - the URI for the request.
- `vastResponse` - the [`VastResponse`](https://github.com/unruly/vast-parser/blob/master/src/model/vastResponse.js) by being built reference.

#### Caveats

- VastAdManager currently does not support NodeJS as it relies on jQuery.

### VastErrorCodes

An Enum of possible error codes on a `VastError` (see `vastAdManager.requestVastChain` section).

[For possible values, see the module.](https://github.com/unruly/vast-parser/blob/master/src/vastErrorCodes.js)

### VastParser

#### VastParser.parse(doc: (Document | { xml: string })): Document

Parses a given VAST document into a JSXMLNode. JSXMLNode a simple JS representation of an XML document.

#### Caveats

- To work in NodeJS, you'll need to pass a `Document`. Use a library like `xmldom` to parse your document string before sending it to `VastParser.parse`.

## License

License information can be found in the LICENSE file.

# vast-parser

Parses VAST files into plain javascript objects

## Requirements

The library currently makes use of the current projects and is dependent on them:

- [RequireJS](http://requirejs.org/)
- [jQuery](https://jquery.com/)
- [Q](https://github.com/kriskowal/q)
- [Validator](https://github.com/chriso/validator.js)

## Usage

The main module to use is `vastAdManager` which exposes two functions:

- `requestVastChain`
- `addEventListener`

### requestVastChain

The `requestVastChain` returns a promise and will resolve once it has finished downloading all of the VAST files in the chain.
It returns a `VastResponse` [object](https://github.com/unruly/vast-parser/blob/master/src/js/model/vastResponse.js).


```
vastAdManager.requestVastChain('http://example.com/vast-file.xml')
    .fail(function(vastError) {
        // handle any errors that may have occurred such as an HTTP 404.
    })
    .then(function(vastResponse) {
        // use the vastResponse
    });

```

### addEventListener

It is possible to register event listeners for when a request is about to be made and when it has finished.

- `requestStart` - start of request for VAST file
- `requestEnd` - end of request for VAST file

These events can be useful for logging purposes or for timing how long each request takes.

Each event passes has the following properties available:

- `requestNumber` - the current request number, which can be more than one when VAST wrapper files are used
- `uri` - the URI for the request
- `vastResponse` - the `VastResponse` [object](https://github.com/unruly/vast-parser/blob/master/src/js/model/vastResponse.js) that is being added to while following a chain of VAST files.

## Running Tests

In one terminal run

    npm start
    
Then go to [http://localhost:8000/test/phantom/testrunner.html](http://localhost:8000/test/phantom/testrunner.html) in your browser.
Or run `npm test`
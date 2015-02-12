require.config({
    baseUrl: '../../../src/js',
    paths: {
        Squire: '../../node_modules/squirejs/src/Squire',
        text: '../../node_modules/requirejs-text/text',
        jquery: '../../node_modules/jquery/dist/jquery',
        q: '../../node_modules/q/q',
        validator: '../../node_modules/validator/validator'
    }
});

require([
    '../specs/xml-parser-spec.js',
    '../specs/vastAdManagerSpec.js',
    '../specs/vast-parser-spec.js',
    '../specs/vastChainerSpec.js',
    '../specs/vastErrorSpec.js',
    '../specs/model/vastResponseSpec.js'
], function() {
    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    }
    else {
        mocha.run();
    }
});
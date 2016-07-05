require.config({
    baseUrl: '../../../src/js',
    paths: {
        Squire: '../../node_modules/squirejs/src/Squire',
        text: '../../node_modules/requirejs-text/text',
        jquery: '../../node_modules/jquery/dist/jquery',
        es6promise: '../../node_modules/es6-promise/dist/es6-promise'
    }
});

require([
    '../specs/xml-parser-spec.js',
    '../specs/vastAdManagerSpec.js',
    '../specs/vast-parser-spec.js',
    '../specs/vastChainerSpec.js',
    '../specs/vastErrorSpec.js',
    '../specs/model/vastResponseSpec.js',
    '../specs/util/objectUtilSpec.js',
    '../specs/model/vastLinearCreativeSpec.js',
    '../specs/model/vastNonLinearCreativeSpec.js',
    '../specs/util/helpersSpec.js',
    '../specs/model/vastExtensionSpec.js',
    '../specs/model/vastMediaFileSpec.js'
], function() {
    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    }
    else {
        mocha.run();
    }
});
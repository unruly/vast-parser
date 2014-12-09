require.config({
    baseUrl: '../../../src/js',
    paths: {
        Squire: '../../node_modules/squirejs/src/Squire',
        text: '../../node_modules/requirejs-text/text'
    }
});

require([
    '../specs/vast-parser-spec.js'
], function() {
    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    }
    else {
        mocha.run();
    }
});
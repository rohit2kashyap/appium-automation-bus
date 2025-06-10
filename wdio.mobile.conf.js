const { config } = require('./wdio.conf.js');

// Override specs to run only Chrome mobile test
config.specs = [
    './test/specs/homepage.chrome.mobile.e2e.js'
];

// Override capabilities for mobile only
config.capabilities = [{
    // Chrome Mobile view (iPhone 13/14 Standard - Most Common Modern Mobile)
    browserName: 'chrome',
    'goog:chromeOptions': {
        args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'],
        mobileEmulation: {
            deviceMetrics: {
                width: 390,
                height: 780,
                pixelRatio: 3
            },
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
        }
    }
}];

exports.config = config;
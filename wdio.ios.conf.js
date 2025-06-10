const { config } = require('./wdio.conf.js');

// Override specs to run only iOS Safari test
config.specs = [
    './test/specs/homepage.ios.safari.e2e.js'
];

// Override capabilities for iOS only
config.capabilities = [{
    // iOS Safari simulator
    platformName: 'iOS',
    browserName: 'Safari',
    'appium:deviceName': 'iPhone 14 Pro Max',
    'appium:platformVersion': '16.1',
    'appium:automationName': 'XCUITest'
}];

exports.config = config; 
# React Appium Tests - Chrome Desktop, Mobile & iOS Safari

This project contains WebDriver IO tests that can run on Chrome (desktop/mobile views) and iOS Safari simulator on macOS.

## Prerequisites

1. **Node.js** - Make sure you have Node.js installed
2. **Chrome Browser** - Make sure Google Chrome is installed on your Mac
3. **Xcode & iOS Simulator** - For iOS testing (make sure Xcode is installed)
4. **Dependencies** - Install project dependencies:
   ```bash
   npm install
   ```

## Available Test Configurations

### 1. All Platforms (Default)
Runs tests on Chrome desktop, Chrome mobile, and iOS Safari:
```bash
npm test
# or
npx wdio run wdio.conf.js
# or
npm run test:all
```

### 2. Chrome Desktop Only
Runs tests only on Chrome desktop view:
```bash
npm run test:desktop
```

### 3. Chrome Mobile Only
Runs tests only on Chrome mobile view (iPhone 12 Pro simulation):
```bash
npm run test:mobile
```

### 4. iOS Safari Only
Runs tests only on iOS Safari simulator:
```bash
npm run test:ios
```

### 5. Chrome Only (Both Desktop and Mobile)
Runs tests on both Chrome desktop and mobile views:
```bash
npm run test:chrome
```

### 6. Sequential Run (All Platforms)
Runs desktop, mobile, then iOS tests sequentially:
```bash
npm run test:sequential
```

## Configuration Details

### Desktop Configuration (`wdio.desktop.conf.js`)
- Browser: Chrome (full desktop view)
- Window size: Default Chrome window size
- Features: Web security disabled for testing

### Mobile Configuration (`wdio.mobile.conf.js`)
- Browser: Chrome with mobile emulation
- Device: iPhone 12 Pro simulation
- Features: Web security disabled for testing

### Main Configuration (`wdio.conf.js`)
- Runs Chrome desktop, Chrome mobile, and iOS Safari configurations in parallel
- Base URL: https://tickets.paytm.com
- Framework: Mocha
- Reporter: Spec reporter
- Appium service enabled for iOS testing

### iOS Configuration (`wdio.ios.conf.js`)
- Browser: Safari on iOS Simulator
- Device: iPhone 14 Pro Max
- iOS Version: 16.1
- Automation: XCUITest

## Test Structure

Tests are located in:
```
test/
└── specs/
    └── homepage.e2e.js
```

## Mobile Device Options

You can modify the mobile device simulation by changing the `deviceName` in `wdio.mobile.conf.js`. Available options include:
- iPhone 12 Pro
- iPhone 13 Pro
- iPhone 14 Pro
- iPad Pro
- Samsung Galaxy S21
- Pixel 5
- And many more Chrome DevTools device presets

## Debugging

To run tests with additional logging:
1. Change `logLevel: 'info'` to `logLevel: 'debug'` in the config files
2. Run tests normally

## Troubleshooting

### Chrome Driver Issues
If you encounter Chrome driver issues, try:
```bash
npm install chromedriver@latest
```

### Port Conflicts
If you get port conflicts, the tests will automatically find available ports.

### Browser Not Found
Make sure Google Chrome is installed and accessible from your PATH. 
Given('open BundleUp app') do

  if RbConfig::CONFIG['host_os'].downcase.include?('linux') || RbConfig::CONFIG['host_os'].downcase.include?('darwin')
    # Assume it's iOS since macOS/Linux does not support Android natively
    ios_caps = {
      'deviceName' => 'iPhone 12',
      'platformName' => 'iOS',
      'automationName' => 'XCUITest',
      'platformVersion' => '15.0',
      'app' => '/Users/mohamed/bundleup/bundleup/e2e/bundleup.app'
      # Add any other iOS-specific capabilities as needed
    }

    common_caps = {
      'autoAcceptAlerts' => true
    }

    caps = ios_caps.merge(common_caps)
  elsif RbConfig::CONFIG['host_os'].downcase.include?('mingw') || RbConfig::CONFIG['host_os'].downcase.include?('mswin') || RbConfig::CONFIG['host_os'].downcase.include?('cygwin')
    # Assume it's Android since Windows typically runs Android emulators
    android_caps = {
      'platformName' => 'Android',
      'deviceName' => 'emulator-5554',
      'app' => 'D:\\Work\\BundleUp2\\mobile\\e2e\\BundleUp-staging.apk',
      'appActivity' => '.MainActivity', # Replace with your actual app activity
      'appPackage' => 'com.bundleup.android' # Replace with your actual app package
    }

    caps = android_caps
  else
    raise 'Unsupported platform. Unable to determine whether it is iOS or Android.'
  end

  # Start the Appium driver
  appium_driver = Appium::Driver.new({ 'caps' => caps }, true)
  $appium = appium_driver.start_driver
  $appium.manage.timeouts.implicit_wait = 30
end

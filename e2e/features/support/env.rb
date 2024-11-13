require 'capybara'
require 'capybara/dsl'
require 'capybara/cucumber'
require 'capybara/rspec'
require 'cucumber'
require 'selenium/webdriver'
require 'appium_lib'
require 'net/http'
require 'rspec'
require 'active_support/core_ext/hash'
require 'date'



$root_dir = Dir.pwd
$assets_dir = "#{$root_dir}/assets"
$tmp_dir = "#{$root_dir}/tmp"
$test_artifacts_dir = "#{$root_dir}/test_artifacts"
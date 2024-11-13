

def accessibility_id_maker(field_name, screen_name)
  "#{screen_name.delete(' ')}_#{field_name.delete(' ')}"
end

Given('tap on {string} button within {string} screen') do |string, string2|
  # wait = Selenium::WebDriver::Wait.new(:timeout => 30)
  # wait.until { $appium.find_element(:xpath, "//*[@text='Sign In']").displayed? }

  # $appium.find_element(:xpath, "//*[@text='#{string}']").click  >>> Android
  $appium.find_element(:id, accessibility_id_maker(string, string2)).click

  # $appium.find_element(:xpath, "//*[@accesibilityID='#{string}' or @text='#{string}']").click

  sleep 3

end

Given('login as {string} with password {string}') do |string, string2|
  $appium.find_element(:id, accessibility_id_maker('Email', 'Login')).send_keys(string)
  $appium.find_element(:id, accessibility_id_maker('Password', 'Login')).send_keys(string2)
  $appium.find_element(:id, accessibility_id_maker('Sign In', 'Login')).click
  $appium.find_element(:id, accessibility_id_maker('Sign In', 'Login')).click
end

Given('select {string} from {string}') do |string, string2|
  $appium.find_element(:id, string2).click
  $appium.find_element(:id, string).click
end

Given('select {string}') do |string|
  $appium.find_element(:id, string).click
end

Then('I should see {string}') do |string|
  ele = $appium.find_element(:id, string)
  puts ele.text
  sleep 8
  expect(ele.displayed?).to be_truthy
end

And(/^fill "([^"]*)" field within "([^"]*)" screen with "([^"]*)"$/) do |field, screen, value|
  $appium.find_element(:id, accessibility_id_maker(field, screen)).send_keys(value)
end

And(/^fill "([^"]*)" field with "([^"]*)"$/) do |field, value|
    $appium.find_element(:id, field).send_keys(value)
end

And(/^tap on "([^"]*)"$/) do |text|
  $appium.find_element(:id, text).click
end

Given('scroll down') do
  # For Android
  action = Appium::TouchAction.new.swipe(start_x: 600, start_y: 1000, end_x: 600, end_y: 700, duration: 300)
  action.perform
  sleep 2
end


Given('scroll filters right') do
  # For Android
  action = Appium::TouchAction.new.swipe(start_x: 1000, start_y: 350, end_x: 500, end_y: 350, duration: 300)
  action.perform
  sleep 2
end



When(/^navigate to "([^"]*)" tab$/) do |tab_name|
  $appium.find_element(:id, tab_name).click
  sleep 2
end



When('move to the next field') do
  $appium.press_keycode(61) # Key code for 'TAB' 
end


When('Fill in test zip code') do
  $appium.press_keycode(8)  # Key code for '8'
  $appium.press_keycode(9)  # Key code for '4'
  $appium.press_keycode(10) # Key code for '3'
  $appium.press_keycode(11) # Key code for '2'
  $appium.press_keycode(12) # Key code for '1'
end


When('Fill in test Card Cvc') do
  $appium.press_keycode(8)  # Key code for '1'
  $appium.press_keycode(9)  # Key code for '2'
  $appium.press_keycode(10) # Key code for '3'
end


When('fill the field with {string} into the currently active field') do |value|
  active_element = $appium
  # active_element.click
  active_element.send_keys(value)
end


When('Click') do 
  $appium.press_keycode(66)
end


And('wait for {int} seconds') do |seconds|
  sleep seconds # You can replace 'seconds' with the number of seconds you want to wait
end



And(/^fill "([^"]*)" field within "([^"]*)" screen with a new email address$/) do |field, screen|
  # Generate a random string to create a unique email address
  random_string = ('a'..'z').to_a.shuffle[0, 8].join
  email_address = "#{random_string}@test.com" 

  # Fill the specified field with the generated email address
  $appium.find_element(:id, accessibility_id_maker(field, screen)).send_keys(email_address)
end


And('grant camera permission') do
  allow = 'com.android.permissioncontroller:id/permission_allow_button'
  $appium.find_element(:id, allow).click
end


Then(/^verify that the button text is "Unpublish"$/) do
  # Replace the XPath expression with your actual XPath
  xpath_expression = '//android.view.ViewGroup[@content-desc="sellingDetail_publish"]/android.widget.TextView[2]'

  # Find the element using the XPath
  element = $appium.find_element(:xpath, xpath_expression)

  # Get the text content of the element
  actual_text = element.text.downcase  # Convert to lowercase for case-insensitive comparison

  # Assert that the actual text is "unpublish"
  expect(actual_text).to eq('unpublish')
end
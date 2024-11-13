And(/^take a photo$/) do
  # press_keycode(27)
  Appium::TouchAction().press(15, 704).perform
end
Feature: post and buy listing

  @wip
  Scenario: user login and post listing test
    Given open BundleUp app
    And tap on "SignIn" button within "Launch" screen
    And login as "seller@test.com" with password "0910Password!"
    And wait for 5 seconds
    Then I should see "Shop"

    When navigate to "CameraScreen" tab
    And tap on "post_createNew"
    And grant camera permission
    And tap on "cameraBottom_capture"
    And tap on "imagePreview_done"
    And select "Boys" from "sellingBottom_gender"
    And select "Tops & Tees" from "sellingBottom_category"
    And select "Long Sleeve Tops & Tees"
    And select "0-3 months" from "sellingBottom_size"
    And select "3Doodler" from "sellingBottom_brand"
    And select "Excellent Used" from "sellingBottom_condition"
    And scroll down
    And tap on "DONE"

    And wait for 30 seconds
    And select "sellingDetail_publish"

    # And fill "location" field within "fromAddress" screen with "test location"
    # And fill "addressLine1" field within "fromAddress" screen with "test addressLine1"
    # And scroll down
    # And fill "addressLine2" field within "fromAddress" screen with "test addressLine2"
    # And scroll down
    # And fill "city" field within "fromAddress" screen with "test city"
    # And fill "state" field within "fromAddress" screen with "test state"
    # And fill "zip" field within "fromAddress" screen with "test zip"
    # And scroll down
    # And tap on "update" button within "fromAddress" screen



    And fill "description" field within "inforCard" screen with "Great Bundle"
    And fill "reason" field within "infoCard" screen with "Great Bundle"
    And tap on "infoCard_next"
    And tap on "medium" button within "shippingCard" screen
    And tap on "next" button within "shippingCard" screen
    And fill "price" field within "priceCard" screen with "100"
    And tap on "publish" button within "priceCard" screen
    Then verify that the button text is "Unpublish"




  @wip
    Scenario: user login and buy listing test
      Given open BundleUp app
      And tap on "SignIn" button within "Launch" screen
      And login as "buyer@test.com" with password "0910Password!"
      Then I should see "Shop"

      And tap on "Gender, "
      And tap on "Boys"
      And tap on "Confirm"
      And tap on "Category, "
      And tap on ""
      And tap on "Long Sleeve Tops & Tees"
      And tap on "Confirm"
      And tap on "Sizes, "
      And tap on "0-3 months"
      And tap on "Confirm"
      And scroll filters right
      And tap on "Brands, "
      And tap on "3Doodler"
      And tap on "Confirm"


      And tap on "addToCart_feedCard"
      When navigate to "CartScreen" tab
      When navigate to "CartScreen" tab
      And tap on "Checkout"
      And wait for 30 seconds
      And fill "email" field with "buyer@test.com"
      And scroll down
      And fill "shippingName" field with "Test Name"
      And scroll down
      And fill "shippingAddressLine1" field with "Test Address 1"
      And fill "shippingAddressLine2" field with "Test Address 2"
      And scroll down
      And fill "shippingLocality" field with "Test City"
      And move to the next field
      And Fill in test zip code
      And tap on "shippingAdministrativeArea"
      And tap on "text1"
      And fill "cardNumber" field with "4242 4242 4242 4242"
      And move to the next field
      And fill "cardExpiry" field with "01/27"
      And move to the next field
      And Fill in test Card Cvc
      And scroll down
      And scroll down
      And move to the next field
      And move to the next field
      And move to the next field
      And Click
      And wait for 20 seconds
      Then I should see "DoneButton_PaymentScreen"

      When navigate to "ProfileScreen" tab
      And tap on "Purchase History"
      And wait for 20 seconds
      And tap on "Great Bundle"
      Then I should see ", Received"

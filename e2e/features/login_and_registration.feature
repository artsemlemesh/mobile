Feature: Basic registration and login

@wip2
Scenario: User Login  Test
    Given open BundleUp app
    And tap on "SignIn" button within "Launch" screen
    And login as "jmecp@hi2.in" with password "0910Password!"
    Then I should see "Shop"


@wip1
Scenario: User Registration Test
    Given open BundleUp app
    And tap on "Sign Up" button within "Launch" screen
    And fill "First Name" field within "Register" screen with "Elsai"
    And fill "Last Name" field within "Register" screen with "Deribu"
    # And fill "Email" field within "Register" screen with "elsaideribu@gmail.com"
    And fill "Email" field within "Register" screen with a new email address
    And fill "Password" field within "Register" screen with "Gladiator123@"
    And fill "Confirm Pass" field within "Register" screen with "Gladiator123@"
    When tap on "Sign Up" button within "Register" screen
    When tap on "Sign Up" button within "Register" screen
    And fill "CodeField" field within "Verification" screen with "1234"
    And tap on "Submit" button within "Verification" screen
    And tap on "Submit" button within "Verification" screen
    Then I should see "Shop"


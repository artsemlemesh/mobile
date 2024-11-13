Feature: End to end scenarios

    End to end scenarios to cover the wrokflow of BundleUp app


    Rule: register and seller, post items, register as a buyer, buy this item

        @wip
        Scenario: User login successfully using normal login
            Given open BundleUp app
            # Given register as a new user using the following:
            #     | First Name | Last Name | Email                            | Password      | User Type |
            #     | Mohamed    | Ali       | mohamedabdelmohsen1987@gmail.com | Gladiator123@ | Seller    |
            And tap on "SignIn" button within "Launch" screen
            And login as "jmecp@hi2.in" with password "0910Password!"
            Then I should see "Search styles, brands, etc"
#            When tap on "Gender" button within "Home" screen
            When navigate to "CameraScreen" tab
            And tap on "CameraScreen_Create New"
            And take a photo
            And select photo from galary
            And tap on "Crop" button
            And tap on "Confrim" within Camera
            Then photo should be added successfully
            When select "Boys" from "Gender"
            And select "Shoes::Baby Shoes" from "Category"
            And select "7 (Baby)" from "Size"
            And select "Nike" from "Brands"
            And select "Good Used" from "Condition"
            Then review that the selections are correct
            When tap on "Done"
            

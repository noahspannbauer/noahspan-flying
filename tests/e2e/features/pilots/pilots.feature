@pilots
Feature: Pilots

    Background: Navigate to the Pilots page
        Given the user is on the homepage
        When the user clicks the "Pilots" navbar link
        Then the user is on the "Pilots" page

    # Scenario: Cancel Pilot drawer
    #     Given the user is on the "Pilots" page
    #     When the user clicks the New button
    #     Then the pilot drawer is visible
    #     When the user clicks the pilot drawer cancel button
    #     Then the pilot drawer is no longer visible

    # Scenario: Add pilot
    #     Given the user is on the "Pilots" page
    #     When the user clicks the Add Pilot button
    #     And the pilot drawer is visible
    #     And the user enters the pilot's information
    #     And the user clicks the Save button
    #     Then the Add Pilot drawer is no longer visible
    #     And the pilot is in the Pilots list
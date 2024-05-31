@pilots
Feature: Pilots

    Background: Navigate to the Pilots page
        Given the user is on the homepage
        When the user clicks the "Pilots" navbar link
        Then the user is on the "Pilots" page

    Scenario: Cancel Add Pilot drawer
        Given the user is on the "Pilots" page
        When the user clicks the New button
        Then the pilot drawer is visible
        When the user clicks the pilot drawer cancel button
        Then the pilot drawer is no longer visible
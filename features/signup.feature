Feature: Signup
  As a user of collectionism
  I want to create an account
  So that I can use the app

  Scenario: 
    When I signup with username "testUsername", password "secret", and email "test@test.com"
    Then I should get back a user with username "testUsername" and email "test@test.com"
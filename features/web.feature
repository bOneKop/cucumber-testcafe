Feature: web test

  @web
  Scenario Outline: web test
    Given Test begin "<name>"
    Then test web testcafe "<browser>"
    Examples:
      |   name            | browser       |
      |  web-ie           | ie            |
      |  web-chrome       | chrome        |
      |  web-firefox      | firefox       |
      |  web-edge         | edge          |
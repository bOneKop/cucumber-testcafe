Feature: ios h5 test

  @ios
  Scenario Outline: ios h5 test
    Given Test begin "<name>"
    Then test ios testcafe "<browser>"
    Examples:
      |   name        | browser                      |
      |   safari      | com.apple.mobilesafari       |
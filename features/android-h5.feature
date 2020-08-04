Feature: android h5 test

  @android
  Scenario Outline: android h5 test
    Given Test begin "<name>"
    Then test android testcafe "<browser>"
    Examples:
      |   name        | browser                      |
      |   jiebao      | com.ijinshan.browser_fast    |
      |   chrome      | com.android.chrome           |
      |    qq         | com.tencent.mtt              |
      |    firefox    | cn.mozilla.rocket            |
      |    opera      | com.opera.browser            |
      |   sogou       | sogou.mobile.explorer        |
      |   jisu        | com.qihoo.contents           |
      |   UC          | com.UCMobile.intl            |
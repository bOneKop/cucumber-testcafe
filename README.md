# cucumber-testcafe
A demo to test web、android、IOS browser in cucumber-testcafe
## framework setting
```
1, cucumber and testcafe remoteconnect
2, Using one scrpit testing in PC web and Android h5 and IOS h5
samples in demo：
Web: ie, chrome, firefox
Android: liebao, chrome, qq, firefox, opera, sogou, jisu, UC
IOS: safari(can add more)
```

## IOS requirement
```
1, run on MacOS
2, There is a project like https://github.com/bOneKop/IOStest
```

## install
```
npm i
```
## Android
```
./node_modules/.bin/cucumber-js --tags "@android"
```
## IOS
```
./node_modules/.bin/cucumber-js --tags "@ios"
```
## Web
```
./node_modules/.bin/cucumber-js --tags "@web"
import {Selector} from 'testcafe';
import {RequestLogger} from 'testcafe';
const {expect} = require("chai");

const simpleLogger = RequestLogger('', {
    logRequestBody: true,
    stringifyRequestBody: true,
    logResponseBody: true,
    stringifyResponseBody: true
});
fixture`baidu`
    .page`http://www.baidu.com/`;
test.requestHooks(simpleLogger)(`baidu`, async t => {
    const search_input = Selector('#kw');
    const search_button = Selector('#su');
    await t.typeText(search_input, 'testcafe', {replace: true});
    await t.setNativeDialogHandler(() => true).click(search_button);
});

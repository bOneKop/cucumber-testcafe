const {Given, When, Then} = require('cucumber');
const createTestCafe = require('testcafe');
const path = require("path");
const net = require('net');
const fs = require('fs');
const {setDefaultTimeout} = require("cucumber");
let runner = null;
let testcafe = null;
// const browsers = [
//     `adb shell am start -a android.intent.action.VIEW -d ${uri} com.android.chrome`
// ];
let uri = '';
setDefaultTimeout(600 * 1000);

const process = require('child_process');

function exec(shell) {
    process.exec(shell, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function portIsOccupied(port) {
    const server = net.createServer().listen(port);
    return new Promise((resolve, reject) => {
        server.on('listening', () => {
            server.close();
            resolve(true)
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false)
            } else {
                reject(err)
            }
        })
    })

}

const runTest_web = async function (host, port, browser) {
    console.log('starting tests');
    await createTestCafe(host, port)
        .then(tc => {
            testcafe = tc;
            const runner = testcafe.createRunner();
            const stream = fs.createWriteStream(`./report/report-sample/web-${browser}--report.html`);
            return runner
                .src([
                    path.join(__dirname, '../../script/baidu.js')
                ])
                .browsers(browser)
                .screenshots(
                    // 保存路径
                    './error/',
                    true,
                    // 保存路劲格式
                    browser + '_${DATE}_${TIME}.png'
                )
                .reporter('st-html', stream)
                .run({
                        skipJsErrors: true,
                        quarantineMode: true,
                        assertionTimeout: 10000,
                        pageLoadTimeout: 10000,
                        selectorTimeout: 10000
                    }
                )
        })
        .then(async failedCount => {
            console.log('Tests failed: ' + failedCount);
            await testcafe.close();
        });
};

const runTest = async function (host, port, browser) {
    await createTestCafe(host, port)
        .then(tc => {
            testcafe = tc;
            runner = testcafe.createRunner();

            return testcafe.createBrowserConnection();
        })
        .then(remoteConnection => {
            // Outputs remoteConnection.url so that it can be visited from the remote browser.
            console.log(remoteConnection.url);
            uri = remoteConnection.url;
            const stream = fs.createWriteStream(`./report/report-sample/${browser}--report.html`);

            remoteConnection.once('ready', () => {
                runner
                    .src([
                        path.join(__dirname, '../../script/baidu.js')
                    ])
                    .browsers(remoteConnection)
                    .reporter('st-html', stream)
                    .run({
                            skipJsErrors: true,
                            quarantineMode: true,
                            assertionTimeout: 10000,
                            pageLoadTimeout: 10000,
                            selectorTimeout: 10000
                        }
                    )
                    .then(failedCount => {
                        console.log(failedCount);
                        testcafe.close();
                    });
            });
        });
};

Given(/^Test begin "([^"]*)"$/, async function (name) {
    console.log("test begin " + name)
});

Then("test android testcafe {string}", async function (browser) {
    for (let i = 0; i < 120; i++) {
        if (await portIsOccupied(this.exec_port)) {
            break;
        }
        await sleep(5000);
    }
    await runTest(this.exec_host, this.exec_port, browser);
    let cmd = `adb shell am start -a android.intent.action.VIEW -d ${uri} ${browser}`;
    console.log(cmd);
    exec(cmd);
});

Then("test ios testcafe {string}", async function (browser) {
    for (let i = 0; i < 120; i++) {
        if (await portIsOccupied(this.exec_port)) {
            break;
        }
        await sleep(5000);
    }
    await runTest(this.exec_host, this.exec_port, browser);
    let cmd1 = `sed -i "" 's!let bundleID.*!let bundleID="${browser}"!g' /Users/lzy/Desktop/testapp/testappUITests/testappUITests.swift`;
    let cmd2 = `sed -i "" 's!let url.*!let url="${uri}"!g' /Users/lzy/Desktop/testapp/testappUITests/testappUITests.swift`;
    let cmd3 = `xcodebuild -project /Users/lzy/Desktop/testapp/testapp.xcodeproj -scheme testapp -sdk iphoneos -destination 'platform=iOS,name=iPhonexr' test`;
    console.log(cmd1);
    await sleep(2000);
    exec(cmd1);
    console.log(cmd2);
    await sleep(2000);
    exec(cmd2);
    console.log(cmd3);
    await sleep(2000);
    exec(cmd3);
});


Then("test web testcafe {string}", async function (browser) {
    await runTest_web(this.exec_host, this.web_exec_port, browser);
});
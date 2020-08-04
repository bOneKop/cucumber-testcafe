const {setWorldConstructor} = require("cucumber");

class CustomWorld {
    constructor() {
        this.exec_host = '192.168.1.114';
        this.exec_port = '1300';
        this.web_exec_port = '1301';
    }
}

setWorldConstructor(CustomWorld);
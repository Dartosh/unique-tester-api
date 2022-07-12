const path = require('path');
const querystring = require("querystring");
const { Curl } = require("node-libcurl");
const mcrypt = require

const serverType = 'server';
const localServer = 'http://63.250.59.172';
const localUrl = 'http://63.250.59.172/api/'

class EtxtAntiPlagiat {
    constructor() {
        this.serverUrl = 'http://136.243.95.186:11035/etxt_antiplagiat';
        this.serverType = 'server';
        this.localServer = 'http://63.250.59.172';
        this.localUrl = 'http://63.250.59.172/api/index.js';
        this.itemsToCheck = [];
        this.xmlPath = path.join(__dirname, '..', 'data');
        this.typesObjects = 'text';
        this.useCrypt = 'j1YkIs3Mf9QadPwe';
        this.isConnect = false;
        this.error = '';
        this.sort = 0;

        const curlTest = new Curl();

        curlTest.setOpt(Curl.option.URL, this.serverUrl);
        curlTest.setOpt(Curl.option.HEADER, 0);
        curlTest.setOpt(Curl.option.POST, 1);
        curlTest.setOpt(Curl.option.POSTFIELDS, 'try=1');
        curlTest.setOpt(Curl.option.TRANSFERTEXT, 1);
        curlTest.setOpt(Curl.option.TIMEOUT, 5);

        curlTest.on('end', (statusCode, data, headers) => {
            if (statusCode === 200) {
                this.isConnect = true;
            }

            console.log(`
                In constructor:

                Status code: ${statusCode};
                Response: ${data};
                this.isConnect: ${this.isConnect};


            `);
        });

        curlTest.perform();
    }

    getAbsolutePath() {
        console.log(this.xmlPath);
    }

    addItemToCheck(data) {
        if (!data.hasOwnProperty('id')) {
            return false;
        }

        this.itemsToCheck.push({
            id: data.id,
            text: data.text,
            type: data.type,
            name: data.name,
            uservars: data.uservars,
        });

        return true;
    }

    codeText(text) {
        const buff = new Buffer(text);

        return buff.toString('base64');
    }

    execRequest(create = 1) {
        // if (create && !this.createXml()) {
        //     return false;
        // }

        const curlTest = new Curl();

        curlTest.setOpt(Curl.option.URL, this.serverUrl);
        curlTest.setOpt(Curl.option.HEADER, 0);
        curlTest.setOpt(Curl.option.POST, 1);
        curlTest.setOpt(
            Curl.option.POSTFIELDS,
            `xmlUrl=${this.localServer}/${path.basename(this.xmlPath)}&xmlAnswerUrl=${this.localUrl}`
        );
        curlTest.setOpt(Curl.option.TRANSFERTEXT, 1);
        curlTest.setOpt(Curl.option.TIMEOUT, 5);

        // console.log(
        //     `xmlUrl=${this.localServer}/${path.basename(this.xmlPath)}&xmlAnswerUrl=${this.localUrl}`
        // );

        curlTest.on('end', (statusCode, data, headers) => {
            console.log(`
                In exec request:

                statusCode: ${statusCode};
                data: ${JSON.stringify(data)};
                headers: ${headers};

                
            `);
        });

        curlTest.perform();

    }

    createXml() {
        const str = `
        <?xml version="1.0" encoding="UTF-8" ?'.'>
        <root>
        <serverType>${this.serverType}</serverType>
        ${this.itemsToCheck.map((el) => {
            // const uservars = el.hasOwnProperty('uservars')
            //     ? `
            //         <uservars>
            //             ${el.uservars.map((uvar, id) => `<${id}>${uvar}</${id}>`)}
            //         </uservars>
            //     ` 
            //     : ``;

            const text = el.hasOwnProperty('text') && el.text.length
                ? `<text>${el.text}</text>`
                : ``
            return `
            <entry>
                <id>${el.id}</id>dasf
                <type>${el.type}</type>'
                <name>${el.name}</name>
                ${text}
            </entry>`
        }).join('')}
        </root>`;

        // console.log(str);

        // if (this.useCrypt) {
        //     const td = mcrypt_module_open (MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_ECB, '');
        //     mcrypt_generic_init ($td, $this->useCrypt, $this->useCrypt);
        //     $string = mcrypt_generic ($td, $string);
        //     mcrypt_generic_deinit ($td);
        //     mcrypt_module_close ($td);
        // }
    }
}

module.exports = {
    EtxtAntiPlagiat,
}
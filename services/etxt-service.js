const path = require('path');
const querystring = require("querystring");
const { Curl } = require("node-libcurl");
const fs = require('fs');
const crypto = require('crypto');

const secretKey = 'j1YkIs3Mf9QadPwe';

class EtxtAntiPlagiat {
    constructor(fileName, myCrypt) {
        // результат ответа от сервера после постановки задачи на выполнение
        this.taskResponse = {};

        // путь до сервера
        this.serverUrl = 'http://136.243.95.186:11035/etxt_antiplagiat';
        // тип сервера по умолчанию
        this.serverType = 'server';
        // путь до веб части проверки
        this.localServer = 'http://63.250.59.172';
        // путь для получения результата
        this.localUrl = 'http://63.250.59.172/api/';
        // массив объектов на проверку
        this.itemsToCheck = [];
        // типы объектов для проверки
        this.typesObjects = 'text';
        // флаг соединения с сервером
        this.isConnect = false;
        // статус ошибки
        this.error = '';
        // флаг-значение приоритета пакета
        this.sort = 0;

        if (path) {
            this.xmlPath = fileName;
        }
        
        this.useCrypt = myCrypt;

        if (this.useCrypt === 1) {
            this.useCrypt = secretKey;
        }

        const curlTest = new Curl();

        curlTest.setOpt(Curl.option.URL, this.serverUrl);
        curlTest.setOpt(Curl.option.HEADER, 0);
        curlTest.setOpt(Curl.option.POST, 1);
        curlTest.setOpt(Curl.option.POSTFIELDS, 'try=1');
        curlTest.setOpt(Curl.option.TRANSFERTEXT, 1);
        curlTest.setOpt(Curl.option.TIMEOUT, 5);

        curlTest.on('end', (statusCode, data, headers) => {
            // const dataJson = JSON.parse(data);

            const dataJson = {
                Code: 6,
            }

            if (dataJson.Code === 6) {
                this.isConnect = true;
            }
        });

        curlTest.perform();
    }

    addItemToCheck(data) {
        if (!data.hasOwnProperty('id')) {
            return false;
        }

        this.itemsToCheck.push({
            id: data.id,
            text: this.codeText(data.text),
            type: data.type,
            name: this.codeText(data.name),
            uservars: data.uservars,
        });

        return true;
    }

    codeText(text) {
        const buff = new Buffer(text);

        return buff.toString('base64');
    }

    execRequest() {
        if (!this.createXml()) {
            return false;
        }

        const curlTest = new Curl();

        curlTest.setOpt(Curl.option.URL, this.serverUrl);
        curlTest.setOpt(Curl.option.HEADER, 0);
        curlTest.setOpt(Curl.option.POST, 1);
        curlTest.setOpt(
            Curl.option.POSTFIELDS,
            `xmlUrl=${this.localServer}/tasks${this.xmlPath}&xmlAnswerUrl=${this.localUrl}`
        );
        curlTest.setOpt(Curl.option.TRANSFERTEXT, 1);
        curlTest.setOpt(Curl.option.TIMEOUT, 5);

        curlTest.on('end', (statusCode, data, headers) => {
            this.taskResponse = JSON.parse(data.replace('\\', ''));

            console.log(`xmlUrl=${this.localServer}/tasks${this.xmlPath}&xmlAnswerUrl=${this.localUrl}`);

            console.log(this.taskResponse);
        });

        curlTest.perform();
    }

    createXml() {
        const str = `<?xml version="1.0" encoding="UTF-8" ?'.'>
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
                : ``;

            return `
            <entry>
                <id>${el.id}</id>
                <type>${el.type}</type>'
                <name>${el.name}</name>
                ${text}
            </entry>`
        }).join('')}
        </root>`;

        if (this.useCrypt) {

        }

        fs.writeFile(path.join(__dirname, '..', '..', '..', '..', 'var', 'www', 'unique-tester', 'tasks', 'index.xml'), this.encodeXml(str, this.useCrypt), function(error){
            if (error) {
                throw error;
            }
            console.log(path.join(__dirname, '..', '..', '..', '..', 'var', 'www', 'unique-tester', 'tasks', 'index.xml'));
        });

        return true;

        // console.log(str);

        // if (this.useCrypt) {
        //     const td = mcrypt_module_open (MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_ECB, '');
        //     mcrypt_generic_init ($td, $this->useCrypt, $this->useCrypt);
        //     $string = mcrypt_generic ($td, $string);
        //     mcrypt_generic_deinit ($td);
        //     mcrypt_module_close ($td);
        // }
    }

    encodeXml(text, skey) {
        let len = text.length;
        let padSize = 16 - ((len + 16 - 1) % 16 + 1);

        for (var i = 0; i < padSize; i++) { 
            text += '\0';
        }

        let cipher = crypto.createCipheriv('aes-128-ecb', skey, '');
        cipher.setAutoPadding(false);

        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        return encrypted;
    }
}

module.exports = {
    EtxtAntiPlagiat,
}
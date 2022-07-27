const path = require('path');
const querystring = require("querystring");
const { Curl } = require("node-libcurl");
const fs = require('fs');
const crypto = require('crypto');

const secretKey = 'j1YkIs3Mf9QadPwe';
const algorithm = 'aes128';
// const cipher = crypto.createCipher(algorithm, secretKey);

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
        return Buffer.from(text).toString('base64');
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
            `xmlUrl=${this.localServer}/tasks.xml&xmlAnswerUrl=${this.localServer}/info.php`
        );
        curlTest.setOpt(Curl.option.TRANSFERTEXT, 1);
        curlTest.setOpt(Curl.option.TIMEOUT, 5);

        curlTest.on('end', (statusCode, data, headers) => {
            this.taskResponse = JSON.parse(data.replace('\\', ''));
            console.log(this.taskResponse);
        });

        curlTest.perform();
    }

    createXml() {
        let str = `<?xml version="1.0" encoding="UTF-8" ?>`;
        str = str + `\n <root>`;
        str = str + `\n     <serverType>${this.serverType}</serverType>`;
        let entries = this.itemsToCheck.map((el) => {
            let text = el.hasOwnProperty('text') && el.text.length
                ? `<text>${el.text}</text>`
                : ``;

            let substr = `        <entry>`;
            substr = substr + `\n           <id>${el.id}</id>`;
            substr = substr + `\n           <type>${el.type}</type>`;
            substr = substr + `\n           <type>${el.type}</type>`;
            substr = substr + `\n           <name>${el.name}</name>`;
            substr = substr + `\n           ${text}`;
            substr = substr + `\n       </entry>`
            return substr;
        }).join('')
        str = str + `\n${entries}\n</root>`;

        console.log(str);

        // fs.writeFile(path.join(__dirname, '..', '..', '..', '..', 'var', 'www', 'tasks', 'tasks.xml'), '', function(error){
        //     if (error) {
        //         throw error;
        //     }
        // });

        // fs.writeFile(path.join(__dirname, '..', '..', '..', '..', 'var', 'www', 'tasks', 'tasks.xml'), this.encryptXml(str), function(error){
        //     if (error) {
        //         throw error;
        //     }
        // });

        return true;
    }

    // encodeXml(text, skey) {
    //     let len = text.length;
    //     let padSize = 16 - ((len + 16 - 1) % 16 + 1);

    //     for (var i = 0; i < padSize; i++) { 
    //         text += '\0';
    //     }

    //     let cipher = crypto.createCipheriv('aes-128-ecb', skey, '');
    //     cipher.setAutoPadding(false);

    //     let encrypted = cipher.update(text, 'utf8', 'base64');
    //     encrypted += cipher.final('base64');

    //     return encrypted;
    // }

    // encodeXml(text, skey) {
    //     var MCrypt = require('mcrypt').MCrypt;
    //     var rijEcb = new MCrypt('rijndael-128', 'ecb');
    //     rijEcb.open(skey);
    //     var ciphertext = rijEcb.encrypt(text);
    //     return ciphertext.toString('base64');
    // }

    // encryptXml(plainText) {    
    //     return cipher.update(plainText, 'utf-8', 'base64') + cipher.final('base64');
    // }
}

module.exports = {
    EtxtAntiPlagiat,
}
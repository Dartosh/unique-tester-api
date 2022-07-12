const path = require('path');
const querystring = require("querystring");
const { Curl } = require("node-libcurl");
const fs = require('fs');

const secretKey = 'server';

class EtxtAntiPlagiat {
    constructor(fileName, myCrypt) {
        // путь до сервера
        this.serverUrl = 'http://136.243.95.186:11035/etxt_antiplagiat';
        // тип сервера по умолчанию
        this.serverType = 'server';
        // путь до веб части проверки
        this.localServer = 'http://63.250.59.172';
        // путь для получения результата
        this.localUrl = 'http://63.250.59.172/api';
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
            const dataJson = JSON.parse(data);
            if (statusCode === 200) {
                this.isConnect = true;
            }

            console.log(dataJson);
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
                : ``;

            return `
            <entry>
                <id>${el.id}</id>dasf
                <type>${el.type}</type>'
                <name>${el.name}</name>
                ${text}
            </entry>`
        }).join('')}
        </root>`;



        fs.writeFile("hello.txt", "Hello мир!", function(error){
 
            if(error) throw error; // если возникла ошибка
            console.log("Асинхронная запись файла завершена. Содержимое файла:");
            let data = fs.readFileSync("hello.txt", "utf8");
            console.log(data);  // выводим считанные данные
        });

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
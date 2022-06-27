const querystring = require('querystring');
const { curly } = require('node-libcurl');
const googleService = require('./google-service');
const userkey = '7075d2598be0e5ffa5d04829e731fb88';

const getUids = async (texts) => {
    const uids = [];

    for (let text of texts) {
        if (text === '') {
            // uids.push('Нет доступа к тексту');
            uids.push('');
            continue;
        }

        const { statusCode, data, headers } = await curly.post('http://api.text.ru/post', {
            postFields: querystring.stringify({
                text: text,
                userkey,
            }),
        });

        if (!data.hasOwnProperty('text_uid')) {
            // switch(data.error_code) {
            //     case 110:
            //         uids.push('Отсутствует проверяемый текст');
            //         break;
            //     case 111:
            //         uids.push('Проверяемый текст пустой');
            //         break;
            //     case 112:
            //         uids.push('Проверяемый текст слишком короткий');
            //         break;
            //     case 113:
            //         uids.push('Проверяемый текст слишком большой');
            //         break;
            //     case 140:
            //         uids.push('Ошибка доступа на сервере, опробуйте позднее');
            //         break;
            //     case 144:
            //         uids.push('Ошибка доступа на сервере, опробуйте позднее');
            //         break;
            //     case 145:
            //         uids.push('Ошибка доступа на сервере, опробуйте позднее');
            //         break;
            //     case 151:
            //         uids.push('Ошибка доступа на сервере, опробуйте позднее');
            //         break;
            //     case 183:
            //         uids.push('Ошибка доступа на сервере, опробуйте позднее');
            //         break;
            //     case 142:
            //         uids.push('Нехватка символов на балансе');
            //         break;                    
            // }
            uids.push('');
        } else {
            // console.log(data.text_uid);
            uids.push(`${data.text_uid}`);
        }
    }

    return uids;
}

// let awaits = [];

const getUniqueness = async (uids) => {
    // console.log(uids);

    const checkInfo = [];

    for (let uid of uids) {
        if (uid !== '') {
            const { statusCode, data, headers } = await curly.post('http://api.text.ru/post', {
                postFields: querystring.stringify({
                    uid: uid.toString(),
                    userkey,
                    jsonvisible: 'detail',
                }),
            });
        // console.log(data);
            if(!data.hasOwnProperty('error_code')) {
                try {
                    const textUnique = '' + data.text_unique;
                    const waterPercent = '' + JSON.parse(data.seo_check).water_percent;
                    const spamPercent = '' + JSON.parse(data.seo_check).spam_percent;
        
                    const textInfo = {
                        textUnique: textUnique.replace(/\./g, ','),
                        wordsCount: JSON.parse(data.seo_check).count_words,
                        // checkDate: JSON.parse(dataCheck.result_json).date_check,
                        // waterPercent: waterPercent.replace(/\./g, ','),
                        // spamPercent: spamPercent.replace(/\./g, ','),
                        // charsWithSpaceCount: JSON.parse(dataCheck.seo_check).count_chars_with_space,
                        // charsWithoutSpace: JSON.parse(dataCheck.seo_check).count_chars_without_space,
                        isChecked: true,
                    }

                    checkInfo.push(textInfo);
                } catch {
                    checkInfo.push({
                        textUnique: '',
                        wordsCount: '',
                        isChecked: false,
                    });
                }
            }
        } else {
            checkInfo.push({
                textUnique: '',
                wordsCount: '',
                isChecked: false,
            });
        }
    }

    return checkInfo;
}

module.exports = {
    getUids,
    getUniqueness,
}
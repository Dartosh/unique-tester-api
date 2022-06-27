const express = require('express');
const path = require('path');
const runner = require('./services/index');
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = 3001;
const jsonParser = bodyParser.json();

const app = express();

app.use(cors())

app.use(jsonParser);

app.listen(PORT, (req, res) => console.log('Running on port 3001...'));

app.post('/get-uids', async (req, res) => {

    const {
      spreadsheetId,
      rangeSheetTitle,
      columnCheckStatus,
      columnBkTitle,
      columnDockLink,
      columnFirstAntiPlag,
      columnSecondAntiPlag,
      columnWordsNumber,
    } = req.body;

    console.log(req.body);

    // const spreadsheetId = '11TMEy24daorv43mUwWW6GIxOEtv9_0H-O-9Uk4kqx3I';
    // const rangeSheetTitle = 'Лист1';

    // Columns
    // const columnCheckStatus = 'Статус проверки';
    // const columnBkTitle = 'Название БК';
    // const columnDockLink = 'Ссылка ну гугл док';
    // const clumnFirstAntiPlag = 'Первый плагиат';
    // const clumnSecondAntiPlag = 'Второй плагиат';
    // const clumnWordsNumber = 'Кол-во слов дока';
    // const columns = [
    //     columnCheckStatus,
    //     columnBkTitle,
    //     columnDockLink,
    //     clumnFirstAntiPlag,
    //     clumnSecondAntiPlag,
    //     clumnWordsNumber,
    // ];

    // const auth = new google.auth.GoogleAuth({
    //     keyFile: 'client-secret.json',
    //     scopes: [
    //         'https://www.googleapis.com/auth/documents',
    //         'https://www.googleapis.com/auth/spreadsheets',
    //         'https://www.googleapis.com/auth/drive',
    //       ],
    // });

    // const client = await auth.getClient();
    // google.options( { auth: client } );

    // const googleDocuments = google.docs('v1');
    // const googleSheets = google.sheets('v4');

    // const getTable = await googleSheets.spreadsheets.values.get({
    //     spreadsheetId,
    //     range: rangeSheetTitle,
    // });

    // const table = getTable.data.values;

    // const coords = [];

    // const linksMapper = new Map();
    // linksMapper.set('checkStatus', 0);
    // linksMapper.set('bk-title', 1);
    // linksMapper.set('doc-link', 2);
    // linksMapper.set('first-anti-plagiarism', 3);
    // linksMapper.set('second-anti-plagiarism', 4);
    // linksMapper.set('words-number', 5);

    // columns.forEach((title) => {
    //     table.forEach((row, y) => {
    //         row.forEach((curTitle, x) => {
    //             if (curTitle === title) {
    //                 coords.push({
    //                     x: x,
    //                     y: y,
    //                 });
    //             }
    //         });
    //     });
    // });

    // let links = table.map((row) => {
    //     return row[coords[linksMapper.get('doc-link')].x];
    // });

    // links = links.filter(elem => {
    //   if (elem === null || elem === undefined || elem === columnDockLink) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // });

    // const documentIds = links.map((link) => {
    //   return link.substring(
    //     35, 
    //     79,
    //   );
    // });

    // const texts = [];

    // for (let documentId of documentIds) {
    //   try {
    //     const getDoc = await googleDocuments.documents.get({
    //       documentId: documentId,
    //     });
  
    //     const documentContent = getDoc.data.body.content;
  
    //     let text = '';
  
    //     for (let structeralElement of documentContent) {
    //       if (structeralElement.hasOwnProperty('paragraph')) {
    //         const paragraph = structeralElement.paragraph;
    //         if (paragraph.hasOwnProperty('elements')) {
    //           const elements = paragraph.elements
    //           for (let element of elements) {
    //             if (element.hasOwnProperty('textRun')) {
    //               text += element.textRun.content;
    //             }
    //           }
    //         }
    //       }
    //     }
  
    //     texts.push(text);
    //   } catch {
    //     texts.push('');
    //   }
    // }

    const uids = await runner.uploadTexts(
      columnCheckStatus,
      columnBkTitle,
      columnDockLink,
      columnFirstAntiPlag,
      columnSecondAntiPlag,
      columnWordsNumber,
      spreadsheetId,
      rangeSheetTitle,
    );
    
    // const uids = await textRuService.getUids(texts);

    // await googleService.updateSpreadsheetMetadata(googleSheets, spreadsheetId, rangeSheetTitle);

    res.json({ uids });
});

app.post('/check-first', async (req, res) => {
  const {
    firstUids,
    spreadsheetId,
    rangeSheetTitle,
    columnCheckStatus,
    columnBkTitle,
    columnDockLink,
    columnFirstAntiPlag,
    columnSecondAntiPlag,
    columnWordsNumber,
  } = req.body;

  console.log({
    firstUids,
    spreadsheetId,
    rangeSheetTitle,
    columnCheckStatus,
    columnBkTitle,
    columnDockLink,
    columnFirstAntiPlag,
    columnSecondAntiPlag,
    columnWordsNumber,
  });

  await runner.firstCheck(
    firstUids,
    spreadsheetId,
    rangeSheetTitle,
    columnCheckStatus,
    columnBkTitle,
    columnDockLink,
    columnFirstAntiPlag,
    columnSecondAntiPlag,
    columnWordsNumber,
  );

  res.json({ isError: false });
});


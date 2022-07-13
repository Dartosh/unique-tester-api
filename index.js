const express = require('express');
const path = require('path');
const runner = require('./services/index');
const cors = require('cors');
const bodyParser = require('body-parser');

const { EtxtAntiPlagiat } = require('./services/etxt-service');

const PORT = 8800;
const jsonParser = bodyParser.json();

const app = express();

app.use(cors())

app.use(jsonParser);

app.listen(PORT, (req, res) => console.log('Running on port 8800...'));

app.post('/get-uids', async (req, res) => {

    const {
      spreadsheetLink,
      rangeSheetTitle,
      columnCheckStatus,
      columnBkTitle,
      columnDockLink,
      columnFirstAntiPlag,
      columnSecondAntiPlag,
      columnWordsNumber,
    } = req.body;

    const spreadsheetLinkParts = spreadsheetLink.split('/');

    const spreadsheetId = spreadsheetLinkParts[5];

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
    res.json({ uids });
});

app.post('/check-first', async (req, res) => {
  const {
    firstUids,
    spreadsheetLink,
    rangeSheetTitle,
    columnCheckStatus,
    columnBkTitle,
    columnDockLink,
    columnFirstAntiPlag,
    columnSecondAntiPlag,
    columnWordsNumber,
  } = req.body;

  const spreadsheetLinkParts = spreadsheetLink.split('/');
  
  const spreadsheetId = spreadsheetLinkParts[5];

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

app.get('/tasks.xml', async (req, res) => {
  console.log('File requested');
  res.contentType('application/xml');
  res.sendFile(path.join(__dirname , 'index.xml'));
});

app.get('/testing', async (req, res) => {
  const test = new EtxtAntiPlagiat('tasksToCheck', 1);

  setTimeout(() => {
    if (!test.isConnect) {
      throw new Error('Failed to connet to the Etext server...');
    }
  }, 2000);

  const itemsToCheck = [
    {
      id: 1,
      text: 'At vero eos et accusamus et iusto odio dignissimos ducimus',
      type: 'text',
      name: 'Text 1',
    },
    {
      id: 2,
      text: 'qui blanditiis praesentium voluptatum deleniti atque',
      type: 'text',
      name: 'Text 2',
    },
    {
      id: 3,
      text: 'occaecati cupiditate non provident, similique sunt',
      type: 'text',
      name: 'Text 3',
    },
    {
      id: 4,
      text: 'in culpa qui officia deserunt mollitia animi, id est laborum',
      type: 'text',
      name: 'Text 4',
    },
  ]

  itemsToCheck.forEach((text) => {
    test.addItemToCheck(text);
  });


  setTimeout(() => {
    test.execRequest();
  }, 4000);

  setTimeout(() => {
    test.execRequest();
  }, 4000);

  // test.getAbsolutePath();


  res.json({ isError: false });
});

app.post('/', async (req, res) => {
  console.log(req);

  res.end('ok');
});
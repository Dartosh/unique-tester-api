const express = require('express');
const path = require('path');
const runner = require('./services/index');
const cors = require('cors');
const bodyParser = require('body-parser');

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


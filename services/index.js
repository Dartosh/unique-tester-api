const googleService = require('./google-service');
const textRuService = require('./text-ru-service');

async function getTextsFromDocuments(documentIds) {
  const { auth, client, googleDocuments, googleSheets } = await googleService.setGoogleServices();
  for (let documentId of documentIds) {
    try {
      const documentMetadata = await googleService.getDocumentMetadata(googleDocuments, documentId);

      const documentContent = documentMetadata.data.body.content;

      let text = '';

      for (let structeralElement of documentContent) {
        if (structeralElement.hasOwnProperty('paragraph')) {
          const paragraph = structeralElement.paragraph;
          if (paragraph.hasOwnProperty('elements')) {
            const elements = paragraph.elements
            for (let element of elements) {
              if (element.hasOwnProperty('textRun')) {
                text += element.textRun.content;
              }
            }
          }
        }
      }

      text = text.replace(/\n/g, ' ');

      texts.push(text);
    } catch {
      texts.push('');
    }
}
}

const uploadTexts = async (
    columnCheckStatus,
    columnBkTitle,
    columnDockLink,
    clumnFirstAntiPlag,
    clumnSecondAntiPlag,
    clumnWordsNumber,
    spreadsheetId,
    rangeSheetTitle,
    from = 1,
    to = 5,
) => {
  const { auth, client, googleDocuments, googleSheets } = await googleService.setGoogleServices();
  const tableMetadata = await googleService.getSpreadsheetMetadata(googleSheets, spreadsheetId, rangeSheetTitle);

  const table = tableMetadata.data.values;

  const coords = [];

  const columns = [
    columnCheckStatus,
    columnBkTitle,
    columnDockLink,
    clumnFirstAntiPlag,
    clumnSecondAntiPlag,
    clumnWordsNumber,
  ];
  const texts = [];
  const linksMapper = new Map();
  linksMapper.set('checkStatus', 0);
  linksMapper.set('bk-title', 1);
  linksMapper.set('doc-link', 2);
  linksMapper.set('first-anti-plagiarism', 3);
  linksMapper.set('second-anti-plagiarism', 4);
  linksMapper.set('words-number', 5);

  columns.forEach((title) => {
      table.forEach((row, y) => {
          row.forEach((curTitle, x) => {
              if (curTitle === title) {
                  coords.push({
                      x: x,
                      y: y,
                  });
              }
          });
      });
  });

  let links = table.map((row, y) => {
      // if (
      //   y >= from + coords[linksMapper.get('doc-link')].y &&
      //   y <= to + coords[linksMapper.get('doc-link')].y
      // ) {
      //   console.log(row[coords[linksMapper.get('doc-link')].x]);
        
      // };
      return row[coords[linksMapper.get('doc-link')].x]
  });

  links = links.filter(elem => {
      if (elem === columnDockLink) {
        return false;
      } else /*if (elem === null || elem === undefined)*/ {
        return true;
      }
  });

  const documentIds = links.map((link) => {
      if (!link) {
        return '';
      } else {
        return link.substring(
          35, 
          79,
        );
      }
  });

  for (let documentId of documentIds) {
      try {
        const documentMetadata = await googleService.getDocumentMetadata(googleDocuments, documentId);
  
        const documentContent = documentMetadata.data.body.content;
  
        let text = '';
  
        for (let structeralElement of documentContent) {
          if (structeralElement.hasOwnProperty('paragraph')) {
            const paragraph = structeralElement.paragraph;
            if (paragraph.hasOwnProperty('elements')) {
              const elements = paragraph.elements
              for (let element of elements) {
                if (element.hasOwnProperty('textRun')) {
                  text += element.textRun.content;
                }
              }
            }
          }
        }

        text = text.replace(/\n/g, ' ');
  
        texts.push(text);
      } catch {
        texts.push('');
      }
  }

  const uids = await textRuService.getUids(texts);

  
  // let i = 1;
  // for (let uid of uids) {
  //   await textRuService.getUniqueness(i, uid, coords, linksMapper, googleSheets, spreadsheetId, rangeSheetTitle);
  //   i++;
  // }

  return { uids }
};

const firstCheck = async (
  uids,
  spreadsheetId,
  rangeSheetTitle,
  columnCheckStatus,
  columnBkTitle,
  columnDockLink,
  columnFirstAntiPlag,
  columnSecondAntiPlag,
  columnWordsNumber,
  from = 1,
  to = 5,
) => {
  const checkInfo = await textRuService.getUniqueness(uids);

  const { googleSheets } = await googleService.setGoogleServices();
  const tableMetadata = await googleService.getSpreadsheetMetadata(googleSheets, spreadsheetId, rangeSheetTitle);
  
  const updatedTable = tableMetadata.data.values;

  const coords = [];
  const columns = [
    columnCheckStatus,
    columnBkTitle,
    columnDockLink,
    columnFirstAntiPlag,
    columnSecondAntiPlag,
    columnWordsNumber,
  ];
  const linksMapper = new Map();
  linksMapper.set('checkStatus', 0);
  linksMapper.set('bk-title', 1);
  linksMapper.set('doc-link', 2);
  linksMapper.set('first-anti-plagiarism', 3);
  linksMapper.set('second-anti-plagiarism', 4);
  linksMapper.set('words-number', 5);

  columns.forEach((title) => {
    updatedTable.forEach((row, y) => {
      row.forEach((curTitle, x) => {
          if (curTitle === title) {
              coords.push({
                  x: x,
                  y: y,
              });
          }
      });
    });
  });

  for (let i = 0; i < checkInfo.length; i++) {
    updatedTable[coords[linksMapper.get('first-anti-plagiarism')].y + 1 + i][coords[linksMapper.get('first-anti-plagiarism')].x] = `${checkInfo[i].textUnique}`;
    updatedTable[coords[linksMapper.get('words-number')].y + 1 + i][coords[linksMapper.get('words-number')].x] = `${checkInfo[i].wordsCount}`;

    if (checkInfo[i].isChecked === true) {
        updatedTable[coords[linksMapper.get('checkStatus')].y + 1 + i][coords[linksMapper.get('checkStatus')].x] = '1';
    } else {
        updatedTable[coords[linksMapper.get('checkStatus')].y + 1 + i][coords[linksMapper.get('checkStatus')].x] = '0';
    }
  }

  await googleService.updateSpreadsheetMetadata(googleSheets, spreadsheetId, rangeSheetTitle, updatedTable);
}

// const handleEtxtUpload = async () => {

// }

module.exports = {
  uploadTexts,
  firstCheck,
};
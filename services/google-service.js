const { google } = require('googleapis');

const setGoogleServices = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'client-secret.json',
        scopes: [
            'https://www.googleapis.com/auth/documents',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
          ],
    });
    
    const client = await auth.getClient();
    google.options( { auth: client } );
    
    const googleDocuments = google.docs('v1');
    const googleSheets = google.sheets('v4');

    return { auth, client, googleDocuments, googleSheets };
}

const getSpreadsheetMetadata = async (googleSheets, spreadsheetId, rangeSheetTitle) => {
    const getTable = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range: rangeSheetTitle,
    });

    return getTable;
};

const getDocumentMetadata = async (googleDocuments, documentId) => {
    const getDoc = await googleDocuments.documents.get({
        documentId: documentId,
    });

    return getDoc;
}

const updateSpreadsheetMetadata = async (googleSheets, spreadsheetId, range, values) => {

    const data = [{
        range,
        values,
    }];

    const resource = {
        data,
        valueInputOption: 'USER_ENTERED',
    };

    try {
        const result = await googleSheets.spreadsheets.values.batchUpdate({
          spreadsheetId,
          resource,
        });
        console.log('%d cells updated.', result.data.totalUpdatedCells);
        return result;
      } catch (err) {
        // TODO (developer) - Handle exception
        throw err;
    }
}

module.exports = {
    setGoogleServices,
    getSpreadsheetMetadata,
    getDocumentMetadata,
    updateSpreadsheetMetadata,
}
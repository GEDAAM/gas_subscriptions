/**
 * @OnlyCurrentDoc
 */
function setup() {
  const doc = SpreadsheetApp.getActiveSpreadsheet()
  SCRIPT_PROP.setProperty('key', doc.getId())
}

function mockRequest() {
  const testData = {
    test1: 'data1',
    test2: 5,
    test3: {
      'i am groot': { prop: 'i am nested' }
    }
  }

  const event = {
    postData: {
      type: 'json',
      contents: JSON.stringify(testData),
      length: 3
    }
  }

  const doc = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = doc.getSheetByName(SHEET_NAME)

  postWithSheet(event, sheet)
}

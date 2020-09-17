import postWithFormSheet from './post'

export default function mockRequest() {
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
  const sheet = doc.getSheetByName('Form')

  postWithFormSheet(event, sheet)
}

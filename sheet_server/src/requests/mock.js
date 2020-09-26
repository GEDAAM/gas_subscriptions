import { postWithSpreadsheet } from '.'

export default function mockRequest() {
  const testData = {
    operation: 'submit',
    formId: 'lol',
    name: 'data1',
    email: 5,
    register: {
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

  const ss = SpreadsheetApp.getActiveSpreadsheet()

  postWithSpreadsheet(event, ss)
}

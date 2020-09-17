import { fetch } from '../../../lib/fetch'
import { getSpreadsheetAsMatrix, parseMatrixAsObject } from '../../../lib/parseSsData'

export default function sendGroupsDataToServer() {
  // these properties should be secretly set before first execution
  const { FORM_SERVER_KEY, SERVER_URL } = PropertiesService.getDocumentProperties()
  const scriptProperties = PropertiesService.getScriptProperties()
  const repeatCount = scriptProperties.getProperty('repeatCount')

  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const [groupsMatrix] = getSpreadsheetAsMatrix('Turmas', ss)
  const [groupsObjList] = parseMatrixAsObject(groupsMatrix)

  fetch(SERVER_URL, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${FORM_SERVER_KEY}`,
      'Content-type': 'application/json'
    },
    payload: JSON.stringify(groupsObjList)
  })
    .catch(err => {
      console.error(err)
      if (repeatCount <= 5) {
        Utilities.sleep(2 ** repeatCount)
        scriptProperties.setProperty('repeatCount', repeatCount + 1)
        sendGroupsDataToServer()
      } else {
        console.error('Backed off too many times. Stopping script execution until next trigger.')
        scriptProperties.setProperty('repeatCount', 0)
      }
    })
    .then(() => {
      scriptProperties.setProperty('repeatCount', 0)
    })
}

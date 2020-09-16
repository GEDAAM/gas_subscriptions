import { saveDataToCleanSheet } from '../utils/saveToSheet'
export default function separateFormData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const formSheet = ss.getSheetByName('Form')
  const researchSheet = ss.getSheetByName('Motiro')
  const subsSheet = ss.getSheetByName('Students')

  const [headers, ...formData] = formSheet.getDataRange().getValues()
  const formDataObjList = formData.map(row =>
    headers.reduce((rowsObj, header, i) => {
      rowsObj[header] = row[i].toString().replace(/"/g, '')
      return rowsObj
    }, {})
  )

  const [researchHeaders] = researchSheet.getDataRange().getValues()
  const [subsHeaders] = subsSheet.getDataRange().getValues()

  const researchData = formDataObjList
    .map(row => researchHeaders.map(header => row[header]))
    .filter(r => r[3])
  const subsData = formDataObjList
    .map(row => subsHeaders.map(header => row[header]))
    .filter(r => r[3])

  saveDataToCleanSheet(researchSheet, researchData, researchHeaders)
  saveDataToCleanSheet(subsSheet, subsData, subsHeaders)

  SpreadsheetApp.flush()
}

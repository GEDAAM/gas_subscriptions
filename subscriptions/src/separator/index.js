import { saveDataToSheet } from '../../../lib/saveToSheet'
import { getSheetAsMatrix, parseMatrixAsObject } from '../../../lib/parseSsData'
export default function separateFormData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const [formMatrix] = getSheetAsMatrix('Form', ss)
  const [researchMatrix, researchSheet] = getSheetAsMatrix('Motiro', ss)
  const [subsMatrix, subsSheet] = getSheetAsMatrix('Students', ss)

  const [formObjList] = parseMatrixAsObject(formMatrix)
  const [researchObj, researchHeaders] = parseMatrixAsObject(researchMatrix)
  const [subsObj, subsHeaders] = parseMatrixAsObject(subsMatrix)

  formObjList.forEach(row => {
    if (!row.college || row.college === 'null') row.college = row.otherCollege
  })

  const researchIds = researchObj.map(({ id }) => id)
  const researchData = researchObj.concat(
    formObjList.filter(
      ({ id, ingressoFaculdade }) => !researchIds.includes(id) && ingressoFaculdade
    )
  )

  const subsIds = subsObj.map(({ id }) => id)
  const subsData = subsObj.concat(
    formObjList.filter(({ id, name }) => !subsIds.includes(id) && name)
  )

  saveDataToSheet(researchSheet, researchData, researchHeaders, false)
  saveDataToSheet(subsSheet, subsData, subsHeaders, false)

  SpreadsheetApp.flush()
}

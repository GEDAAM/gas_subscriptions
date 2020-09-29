import { saveDataToSheet } from '../../../lib/saveToSheet'
import {
  getIndexedMapWithId,
  getSheetAsMatrix,
  parseMatrixAsObject
} from '../../../lib/parseSsData'
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

  const formsMap = getIndexedMapWithId(
    formObjList.filter(obj => obj.name),
    'id'
  )
  let subsData = []
  formsMap.forEach((formObj, id) => {
    const oldSub = subsObj.find(({ id: i }) => i === id)
    subsData.push({ ...oldSub, ...formObj })
  })

  saveDataToSheet(researchSheet, researchData, researchHeaders, false)
  saveDataToSheet(subsSheet, subsData, subsHeaders, false)

  SpreadsheetApp.flush()
}

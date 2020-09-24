import { getSpreadsheetAsMatrix, parseMatrixAsObject } from '../../lib/parseSsData'
import { deleteTriggers } from '../../lib/triggers'
import { Config } from './config'
import addGroupSheetTriggers from './triggers'

export default function setupGroupUi() {
  const masterSpreadsheet = SpreadsheetApp.openById(Config.MASTER_SHEET_ID)

  // id	vacancies	openVacancies	length	selected	leaders	title	specialty	description	weekDay	startsAt	endsAt	lang	preferenceByYear	preferenceByCollege
  const [groupsMatrix] = getSpreadsheetAsMatrix('Turmas', masterSpreadsheet)
  const [groupsObjList] = parseMatrixAsObject(groupsMatrix)

  deleteTriggers()
  groupsObjList.forEach(({ sheet_id }) => {
    const ss = SpreadsheetApp.openById(sheet_id)
    const [, sheet] = getSpreadsheetAsMatrix(Config.RESERVED_SHEET_NAME, ss)
    sheet.hideSheet()
    addGroupSheetTriggers(ss)
  })
}

import { getSheetAsMatrix, parseMatrixAsObject } from '../../lib/parseSsData'
import { deleteTriggers } from '../../lib/triggers'
import { Config } from './config'
import addGroupSheetTriggers from './triggers'

export default function setupGroupUi() {
  const masterSpreadsheet = SpreadsheetApp.openById(Config.MASTER_SHEET_ID)

  // id	vacancies	openVacancies	length	selected	leaders	title	specialty	description	weekDay	startsAt	endsAt	lang	preferenceByYear	preferenceByCollege
  const [groupsMatrix] = getSheetAsMatrix('Turmas', masterSpreadsheet)
  const [groupsObjList] = parseMatrixAsObject(groupsMatrix)

  deleteTriggers()
  groupsObjList.forEach(({ sheet_id }) => {
    const ss = SpreadsheetApp.openById(sheet_id)
    addGroupSheetTriggers(ss)
  })
}

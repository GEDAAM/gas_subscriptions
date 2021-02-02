import {
  getIndexedMapWithId,
  getSheetAsMatrix,
  mapSpreadsheets,
  parseMatrixAsObject
} from '../../../lib/parseSsData'
import { getGroupSheetId, getSortedMembers } from './sheets_gen'
import { Config } from './config'
import { saveDataToSheet } from '../../../lib/saveToSheet'

export default function updateGroupsSpreadsheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  // timestamp	formId	id	name	email	register	sex	cpf	phoneNumber	course	college	otherCollege	isRegular	semester	isNewbie	semestersInvolved	medium	topicsOfInterest	selectedGroup
  const [usersMatrix] = getSheetAsMatrix('Students', ss)
  const [usersObjList, usersHeader] = parseMatrixAsObject(usersMatrix)
  const usersMap = getIndexedMapWithId(usersObjList, 'register')

  // id	vacancies	openVacancies	length	selected	leaders	title	specialty	description	weekDay	startsAt	endsAt	lang	preferenceByYear	preferenceByCollege
  const [groupsMatrix] = getSheetAsMatrix('Turmas', ss)
  const [groupsObjList] = parseMatrixAsObject(groupsMatrix)

  const groupsWithUsers = groupsObjList.map(({ selected, ...groupObj }) => ({
    ...groupObj,
    members: selected.map(uid => usersMap.get(uid))
  }))

  groupsWithUsers.forEach(({ sheet_id, members }) => {
    if (!sheet_id) return
    const ss = SpreadsheetApp.openById(sheet_id)
    const [[header, uiHeader, ...prevMatrix], sheet] = getSheetAsMatrix(Config.MAIN_SHEET_NAME, ss)
    const [prevMembers] = parseMatrixAsObject([header, ...prevMatrix])
    const newMembers = members.filter(
      ({ register }) => !prevMembers.some(({ register: r }) => r == register)
    )
    const currentHeader = header.filter(h => usersHeader.includes(h))

    saveDataToSheet(sheet, [uiHeader, ...prevMembers, ...newMembers], currentHeader, false)
    sheet
      .getRange(3, 1, sheet.getLastRow() - 3, sheet.getLastColumn() - 1)
      .sort({ column: header.indexOf('name') + 1 || 2, ascending: true })
  })
}

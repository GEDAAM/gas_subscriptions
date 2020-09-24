import {
  getIndexedMapWithId,
  getSpreadsheetAsMatrix,
  parseMatrixAsObject
} from '../../../lib/parseSsData'
import { getGroupSheetId, getSortedMembers } from './sheets_gen'
import { Config } from './config'
import { saveDataToSheet } from '../../../lib/saveToSheet'

export default function generateGroupsSpreadsheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  // timestamp	formId	id	name	email	register	sex	cpf	phoneNumber	course	college	otherCollege	isRegular	semester	isNewbie	semestersInvolved	medium	topicsOfInterest	selectedGroup
  const [usersMatrix] = getSpreadsheetAsMatrix('Students', ss)
  const [usersObjList, usersHeader] = parseMatrixAsObject(usersMatrix)
  const usersMap = getIndexedMapWithId(usersObjList, 'register')

  // register	cpf	email	name	social_name	sex	phoneNumber	course	semester	college
  const [coordsMatrix] = getSpreadsheetAsMatrix('Coord', ss)
  const [coordsObjList] = parseMatrixAsObject(coordsMatrix)
  const coordsMap = getIndexedMapWithId(coordsObjList, 'register')

  // id	vacancies	openVacancies	length	selected	leaders	title	specialty	description	weekDay	startsAt	endsAt	lang	preferenceByYear	preferenceByCollege
  const [groupsMatrix, groupsSheet] = getSpreadsheetAsMatrix('Turmas', ss)
  const [groupsObjList, groupsHeader] = parseMatrixAsObject(groupsMatrix)

  const groupsWithUsers = groupsObjList.map(({ selected, registers, ...groupObj }) => ({
    ...groupObj,
    members: selected.map(uid => usersMap.get(uid)),
    coordinators: registers.map(cid => coordsMap.get(cid))
  }))

  // TODO: error handling
  groupsWithUsers.map((group, i) => {
    const id = getGroupSheetId(group, 'sheet_id')
    groupsObjList[i].sheet_id = id // mutates group object with the id property
    const members = getSortedMembers(group)

    const ss = SpreadsheetApp.openById(id)
    const [[header], sheet] = getSpreadsheetAsMatrix(Config.RESERVED_SHEET_NAME, ss)
    const currentHeader = header.filter(h => usersHeader.includes(h))
    saveDataToSheet(sheet, members, currentHeader, false)
    // sheet.getRange(1, currentHeader.length + 1).setFormula(`{${Config.MAIN_SHEET_NAME}!G2:Z}`)
    sheet.hideSheet()

    return id
  })

  // save sheet ids to database
  const gHeader = !groupsHeader.includes('sheet_id')
    ? groupsHeader.filter(h => h).push('sheet_id')
    : [...groupsHeader]
  saveDataToSheet(groupsSheet, groupsObjList, gHeader)
}

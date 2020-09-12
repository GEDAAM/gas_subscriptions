import {
  getIndexedMapWithId,
  getSpreadsheetAsMatrix,
  parseMatrixAsObject,
  saveColumnsToIndexedSheet,
  setDataToCleanSheet
} from './utils'
import { getGroups } from './groups'
import distributeGroups from './distributeGroups'
import getSortedUsersList from './sortUsers'

function temp() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  // timestamp	name	email	register	cpf	selectedGroup	multiplier	status
  const [usersMatrix, usersSheet] = getSpreadsheetAsMatrix('Subs', ss)
  // id	vacancies	openVacancies	length	selected	leaders	title	specialty	description	weekDay	startsAt	endsAt	lang	preferenceByYear	preferenceByCollege
  const [groupsMatrix, groupsSheet] = getSpreadsheetAsMatrix('Groups', ss)
  // register, multiplier

  const [usersObjList] = parseMatrixAsObject(usersMatrix)
  // grants only unique students, in which only the most recent entry will remain
  const usersMap = getIndexedMapWithId(usersObjList, 'register')

  const groups = getGroups(groupsMatrix)
  const sortedUsers = getSortedUsersList(usersMap)
  const selectionState = distributeGroups(sortedUsers, groups)

  const [groupsHeader] = groupsMatrix
  const [usersHeader] = usersMatrix

  saveColumnsToIndexedSheet(['status', 'finalGroup'], usersHeader, selectionState, usersSheet)
  setDataToCleanSheet(groupsSheet, groups, groupsHeader)

  SpreadsheetApp.flush()
}

global.temp = temp

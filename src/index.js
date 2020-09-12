import {
  getIndexedMapWithId,
  getSpreadsheetAsMatrix,
  parseMatrixAsObject
} from './utils/parseSsData'
import { getGroups } from './groups'
import distributeGroups from './distributeGroups'
import { getSortedUsersList, prepareUsersList, updateUsers } from './users'
import { saveDataToCleanSheet } from './utils/saveToSheet'

function temp() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  // timestamp	name	email	register	cpf	selectedGroup	multiplier	status	finalGroup
  const [usersMatrix, usersSheet] = getSpreadsheetAsMatrix('Subs', ss)
  // id	vacancies	openVacancies	length	selected	leaders	title	specialty	description	weekDay	startsAt	endsAt	lang	preferenceByYear	preferenceByCollege
  const [groupsMatrix, groupsSheet] = getSpreadsheetAsMatrix('Groups', ss)
  // register, multiplier

  const [usersObjList, usersHeader] = parseMatrixAsObject(usersMatrix)
  // grants only unique students, in which only the most recent entry will remain
  const usersMap = getIndexedMapWithId(usersObjList, 'register')

  const groups = getGroups(groupsMatrix)
  const preparedUsersList = prepareUsersList(usersMap)
  const sortedUsers = getSortedUsersList(preparedUsersList)
  const selectionState = distributeGroups(sortedUsers, groups)
  const updatedUsersList = updateUsers(preparedUsersList, selectionState, ['status', 'finalGroup'])

  console.log(updatedUsersList)
  const [groupsHeader] = groupsMatrix
  saveDataToCleanSheet(groupsSheet, groups, groupsHeader)
  saveDataToCleanSheet(usersSheet, updatedUsersList, usersHeader)

  SpreadsheetApp.flush()
}

global.temp = temp

import {
  getIndexedMapWithId,
  getSpreadsheetAsMatrix,
  parseMatrixAsObject
} from '../../../lib/parseSsData'
import { getGroups, Modes } from './groups'
import distributeGroups from './distributeGroups'
import { getSortedUsersList, prepareUsersList, updateUsers } from './users'
import { saveDataToCleanSheet } from '../../../lib/saveToSheet'

function groupsDistributionOrchestrator(mode = Modes.CLEAN) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  // timestamp	name	email	register	cpf	selectedGroup	multiplier	status	finalGroup
  const [usersMatrix, usersSheet] = getSpreadsheetAsMatrix('Subs', ss)
  // id	vacancies	openVacancies	length	selected
  const [groupsMatrix, groupsSheet] = getSpreadsheetAsMatrix('Groups', ss)

  const [usersObjList, usersHeader] = parseMatrixAsObject(usersMatrix)
  // grants only unique students, in which only the most recent entry will remain
  const usersMap = getIndexedMapWithId(usersObjList, 'register')

  // will distribute groups regardless of their previous state of distribution
  // to distribute remaining vacancies, use Modes.RETAINING
  const groups = getGroups(groupsMatrix, mode)
  const [groupsHeader] = groupsMatrix

  const preparedUsersList = prepareUsersList(usersMap)
  const sortedUsers = getSortedUsersList(preparedUsersList)
  const selectionState = distributeGroups(sortedUsers, groups)
  const updatedUsersList = updateUsers(preparedUsersList, selectionState, ['status', 'finalGroup'])

  saveDataToCleanSheet(groupsSheet, groups, groupsHeader)
  saveDataToCleanSheet(usersSheet, updatedUsersList, usersHeader)

  SpreadsheetApp.flush()
}

export function distributeGroupsFromZero() {
  groupsDistributionOrchestrator(Modes.CLEAN)
}

export function distributeRemainingVacancies() {
  groupsDistributionOrchestrator(Modes.RETAINING)
}

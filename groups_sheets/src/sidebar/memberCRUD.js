import { getSheetAsMatrix, parseMatrixAsObject } from '../../../lib/parseSsData'
import { saveDataToSheet } from '../../../lib/saveToSheet'
import { Config } from '../config'
import { showModal } from './modals'

export function getAllMembers() {
  const masterSpreadsheet = SpreadsheetApp.openById(Config.MASTER_SHEET_ID)
  const [usersMatrix] = getSheetAsMatrix('Students', masterSpreadsheet)
  const [usersObjList] = parseMatrixAsObject(usersMatrix)

  return usersObjList
}

export function getCurrentMembers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const [usersMatrix] = getSheetAsMatrix(Config.RESERVED_SHEET_NAME, ss)
  const [usersObjList] = parseMatrixAsObject(usersMatrix)

  return usersObjList
}

export function addMember(member) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const masterSpreadsheet = SpreadsheetApp.openById(Config.MASTER_SHEET_ID)
  const [sheetId] = SpreadsheetApp.getActiveSpreadsheet().getName().split(' ')

  const [usersMatrix, usersSheet] = getSheetAsMatrix('Students', masterSpreadsheet)
  const [usersObjList, usersHeader] = parseMatrixAsObject(usersMatrix)
  const newUsersObjList = usersObjList.map(user => {
    if (user.register === member.register) {
      if (!(user.status === 'REMOVED' || user.status === 'REMAINDER')) {
        throw new Error(
          'Você não pode incluir um membro de outro grupo, peça que o coordenador desse grupo remova-o antes.'
        )
      }
      user.status = 'MOVED'
      user.finalGroup = sheetId
    }
    return user
  })

  const [membersMatrix, currentSheet] = getSheetAsMatrix(Config.RESERVED_SHEET_NAME, ss)
  const [currentMembers, currentHeader] = parseMatrixAsObject(membersMatrix)
  const newCurrentMembers = [...currentMembers, member]

  const [groupsMatrix, groupsSheet] = getSheetAsMatrix('Turmas', masterSpreadsheet)
  const [groupsObjList, groupsHeader] = parseMatrixAsObject(groupsMatrix)
  const newGroupsObjList = groupsObjList.map(group =>
    String(group.id) === sheetId
      ? { ...group, selected: [...group.selected, member.register] }
      : group
  )

  const newCurrentHeader = currentHeader.filter(h => isNaN(new Date(h)))

  saveDataToSheet(currentSheet, newCurrentMembers, newCurrentHeader, false)
  saveDataToSheet(usersSheet, newUsersObjList, usersHeader, false)
  saveDataToSheet(groupsSheet, newGroupsObjList, groupsHeader, false)

  return {
    message: 'Membro incluído com sucesso.'
  }
}

export function removeMember(member) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const masterSpreadsheet = SpreadsheetApp.openById(Config.MASTER_SHEET_ID)

  const [membersMatrix, currentSheet] = getSheetAsMatrix(Config.RESERVED_SHEET_NAME, ss)
  const [currentMembers, currentHeader] = parseMatrixAsObject(membersMatrix)
  const newCurrentMembers = currentMembers.filter(({ register }) => register !== member.register)

  if (newCurrentMembers.length === currentMembers.length) {
    throw new Error('Você não pode remover um membro de outro grupo')
  }
  newCurrentMembers.push(currentHeader.map(() => null)) // will clear the last row

  const [usersMatrix, usersSheet] = getSheetAsMatrix('Students', masterSpreadsheet)
  const [usersObjList, usersHeader] = parseMatrixAsObject(usersMatrix)
  const newUsersObjList = usersObjList.map(user =>
    user.register === member.register ? { ...user, status: 'REMOVED' } : user
  )

  const [groupsMatrix, groupsSheet] = getSheetAsMatrix('Turmas', masterSpreadsheet)
  const [groupsObjList, groupsHeader] = parseMatrixAsObject(groupsMatrix)
  const newGroupsObjList = groupsObjList.map(group =>
    group.id === member.finalGroup
      ? { ...group, selected: group.selected.filter(uid => uid !== member.register) }
      : group
  )

  const [uiMatrix, mainSheet] = getSheetAsMatrix(Config.MAIN_SHEET_NAME, ss)
  mainSheet.deleteRow(uiMatrix.findIndex(([name]) => name === member.name) + 1)
  const newCurrentHeader = currentHeader.filter(h => isNaN(new Date(h)))

  saveDataToSheet(currentSheet, newCurrentMembers, newCurrentHeader, false)
  saveDataToSheet(usersSheet, newUsersObjList, usersHeader, false)
  saveDataToSheet(groupsSheet, newGroupsObjList, groupsHeader, false)

  return {
    message: 'Membro removido com sucesso.'
  }
}

export function moveMember() {
  // remove member from current group
  // add member to destination group
  // update member and groups status on database
}

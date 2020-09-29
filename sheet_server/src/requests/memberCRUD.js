import { getBottomRow, getSheetAsMatrix, parseMatrixAsObject } from '../../../lib/parseSsData'
import { removeRowByIndex, saveDataToSheet } from '../../../lib/saveToSheet'
import { Config } from '../config'

export function getMembersNameReg(masterSpreadsheet) {
  const [usersMatrix] = getSheetAsMatrix('Students', masterSpreadsheet)
  const [usersObjList] = parseMatrixAsObject(usersMatrix)

  return usersObjList.reduce((options, user) => {
    if (user.name) {
      const namereg = `${user.name} | ${user.register}`
      options[namereg] = null
    }
    return options
  }, {})
}

export function addMember(masterSpreadsheet, { uid, currentSheetId }) {
  const ss = SpreadsheetApp.openById(currentSheetId)
  const [sheetId] = ss.getName().split(' ')

  const [usersMatrix, usersSheet] = getSheetAsMatrix('Students', masterSpreadsheet)
  const [usersObjList, usersHeader] = parseMatrixAsObject(usersMatrix)

  let member
  const newUsersObjList = usersObjList.map(user => {
    if (user.register == uid) {
      if (!(user.status === 'REMOVED' || user.status === 'REMAINDER')) {
        throw new Error(
          'Você não pode incluir um membro de outro grupo, peça que o coordenador desse grupo remova-o antes.'
        )
      }
      user.status = 'MOVED'
      user.finalGroup = sheetId
      member = user
    }
    return user
  })

  const [membersMatrix, currentSheet] = getSheetAsMatrix(Config.MAIN_SHEET_NAME, ss)
  const uiHeader = membersMatrix.splice(1, 1)
  const [currentMembers, currentHeader] = parseMatrixAsObject(membersMatrix)
  const newCurrentMembers = [uiHeader, ...currentMembers, member]

  const [groupsMatrix, groupsSheet] = getSheetAsMatrix('Turmas', masterSpreadsheet)
  const [groupsObjList, groupsHeader] = parseMatrixAsObject(groupsMatrix)
  const newGroupsObjList = groupsObjList.map(group => {
    if (group.id == sheetId) {
      group.selected.push(member.register)
      if (+group.openVacancies === 0) {
        group.vacancies = +group.vacancies + 1
      } else {
        group.openVacancies = +group.openVacancies - 1
      }
      group.length = +group.length + 1
    }
    return group
  })

  // register	name	phoneNumber	semester	college	email	topicsOfInterest
  const newCurrentHeader = currentHeader.filter((_, i) => i < 7)
  saveDataToSheet(currentSheet, newCurrentMembers, newCurrentHeader, false)
  saveDataToSheet(usersSheet, newUsersObjList, usersHeader, false)
  saveDataToSheet(groupsSheet, newGroupsObjList, groupsHeader, false)
  currentSheet
    .getRange(3, 1, currentSheet.getLastRow() - 3, currentSheet.getLastColumn() - 1)
    .sort({ column: currentHeader.indexOf('name') + 1 || 2, ascending: true })

  return {
    member
  }
}

export function removeMember(masterSpreadsheet, { uid, currentSheetId }) {
  const ss = SpreadsheetApp.openById(currentSheetId)

  let member
  const [usersMatrix, usersSheet] = getSheetAsMatrix('Students', masterSpreadsheet)
  const [usersObjList, usersHeader] = parseMatrixAsObject(usersMatrix)
  const newUsersObjList = usersObjList.map(user => {
    if (user.register == uid) {
      user.status = 'REMOVED'
      member = { ...user }
      user.finalGroup = null
    }
    return user
  })

  const [membersMatrix, currentSheet] = getSheetAsMatrix(Config.MAIN_SHEET_NAME, ss)
  membersMatrix.splice(1, 1)
  const [currentMembers, currentHeader] = parseMatrixAsObject(membersMatrix)
  const newCurrentMembers = currentMembers.filter(({ register }) => register != uid)
  // throw new Error(JSON.stringify(currentMembers))

  if (newCurrentMembers.length === currentMembers.length) {
    throw new Error('Você não pode remover um membro de outro grupo')
  }
  newCurrentMembers.push(Array(currentHeader.length).fill(null)) // will clear the last row

  const [groupsMatrix, groupsSheet] = getSheetAsMatrix('Turmas', masterSpreadsheet)
  const [groupsObjList, groupsHeader] = parseMatrixAsObject(groupsMatrix)
  const newGroupsObjList = groupsObjList.map(group => {
    if (group.id == member.finalGroup) {
      group.selected = group.selected.filter(uid => uid != member.register)
      group.openVacancies = +group.openVacancies + 1
      group.length = +group.length - 1
    }
    return group
  })

  removeRowByIndex(
    currentSheet,
    currentMembers.findIndex(({ register }) => register === member.register) + 3
  )
  saveDataToSheet(usersSheet, newUsersObjList, usersHeader, false)
  saveDataToSheet(groupsSheet, newGroupsObjList, groupsHeader, false)

  return {
    member
  }
}

export function moveMember() {
  // remove member from current group
  // add member to destination group
  // update member and groups status on database
}

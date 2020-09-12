import { getSpreadsheetAsMatrix, parseMatrixAsObject, setDataToCleanSheet } from './utils'
import { getGroups } from './groups'
import distributeGroups from './distributeGroups'

function temp() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const [usersMatrix] = getSpreadsheetAsMatrix('Subs', ss)
  const [groupsMatrix, groupsSheet] = getSpreadsheetAsMatrix('Groups', ss)
  const [[, bonusList]] = getSpreadsheetAsMatrix('Bonus', ss) // register, multiplier

  const [usersObjList] = parseMatrixAsObject(usersMatrix)
  // grants only unique students
  usersObjList.reverse()
  const usersMap = getIndexedMapWithId(usersObjList, 'register')
  // bonusList.forEach(([uid, bonus]) => {
  //   const user = usersMap.get(uid)
  //   if (user) user.bonus = bonus
  // })

  const usersSelectedList = []
  usersMap.forEach(({ selectedGroup, bonus }, uid) => {
    const selected = selectedGroup ? JSON.parse(selectedGroup) : []
    const multiplier = 1 + (bonus || 0)
    usersSelectedList.push([uid, selected, multiplier])
  })
  usersSelectedList.sort((ua, ub) => ua[2] - ub[2])

  const groups = getGroups(groupsMatrix)
  const selectionState = distributeGroups(usersSelectedList, groups)
  console.log(selectionState)
  const [header] = groupsMatrix
  setDataToCleanSheet(groupsSheet, groups, header)
}

global.temp = temp

function getIndexedMapWithId(objList, idProp) {
  const map = new Map()
  objList.forEach(obj => {
    map.set(obj[idProp], obj)
  })

  return map
}

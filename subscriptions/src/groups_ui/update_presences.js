import { getSpreadsheetAsMatrix, parseMatrixAsObject } from '../../../lib/parseSsData'
import { saveDataToSheet } from '../../../lib/saveToSheet'
import { Config } from './config'

export default function updateUserPresences() {
  const masterSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()

  // timestamp	formId	id	name	email	register	sex	cpf	phoneNumber	course	college	otherCollege	isRegular	semester	isNewbie	semestersInvolved	medium	topicsOfInterest	selectedGroup
  const [usersMatrix, usersSheet] = getSpreadsheetAsMatrix('Students', masterSpreadsheet)
  const [usersObjList, usersHeader] = parseMatrixAsObject(usersMatrix)

  // id	vacancies	openVacancies	length	selected	leaders	title	specialty	description	weekDay	startsAt	endsAt	lang	preferenceByYear	preferenceByCollege
  const [groupsMatrix] = getSpreadsheetAsMatrix('Turmas', masterSpreadsheet)
  const [groupsObjList] = parseMatrixAsObject(groupsMatrix)

  const userPresences = new Map()
  groupsObjList.forEach(({ id: groupId, sheet_id }) => {
    const ss = SpreadsheetApp.openById(sheet_id)
    const [[header, ...data]] = getSpreadsheetAsMatrix(Config.RESERVED_SHEET_NAME, ss)
    const presenceHeader = header.filter(h => !usersHeader.includes(h))
    const presenceIndices = presenceHeader.map(h => header.indexOf(h))
    const idIndex = header.indexOf('register')
    data.forEach(row => {
      const uid = row[idIndex]
      const prevPresence = userPresences.get(uid) || {}
      const presences = {
        ...prevPresence,
        [groupId]: presenceHeader.reduce((obj, h, i) => {
          const key = h instanceof Date ? h.toDateString() : h
          obj[key] = row[presenceIndices[i]]
          return obj
        }, {})
      }
      userPresences.set(uid, presences)
    })
  })

  usersObjList.forEach(user => {
    if (!('presences' in user)) user.presences = {}
    if (!userPresences.has(user.register)) return
    user.presences = {
      ...user.presences,
      ...userPresences.get(user.register)
    }
  })

  if (!usersHeader.includes('presences')) usersHeader.push('presences')
  saveDataToSheet(usersSheet, usersObjList, usersHeader, false)
}

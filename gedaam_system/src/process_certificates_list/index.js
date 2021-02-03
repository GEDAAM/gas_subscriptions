import { includes, each, reduce } from 'lodash'
import { getSheetAsMatrix, parseMatrixAsObject } from '../../../lib/parseSsData'
import { saveDataToSheet } from '../../../lib/saveToSheet'
import { ValidStatuses } from '../distribution/users'

const REFERENCE_SEMESTER = '2020-2'

function getRange() {
  const [year, semester] = REFERENCE_SEMESTER.split('-')
  const months = semester === '1' ? ['janeiro', 'junho'] : ['julho', 'dezembro']
  return months.map(m => `${m} de ${year}`).join(' a ')
}
function getDuration(presencesByGroup) {
  let totalEncountersCount = 0
  let totalApprovedGroups = 0
  let totalCompletedGroups = 0
  each(presencesByGroup, ({ presencePercent, ...encounters }) => {
    const encountersInGroup = reduce(encounters, (tot, enc) => tot + /[PFJ]/.test(enc), 0)
    totalEncountersCount += encountersInGroup
    if (+presencePercent >= 0.75) {
      totalApprovedGroups++ // minimum presence
      if (encountersInGroup >= 8) totalCompletedGroups++ // minimum number of encounters
    }
  })

  if (totalEncountersCount < 8 || totalApprovedGroups < 1) {
    throw new Error("Student didn't reach any certification criteria")
  }

  if (totalCompletedGroups === 0 && totalApprovedGroups < 2) {
    throw new Error("Student reached enough encounters but wasn't approved")
  }

  // totalCompletedGroups can be 0 in case student changed groups along the course
  return 60 * (totalCompletedGroups || 1)
}

function prepareUsersToCertificate(usersObjList) {
  return usersObjList.map(({ presences: presencesByGroup, status, ...user }) => {
    if (!includes(ValidStatuses, status)) return null // filters students that were not selected

    let duration
    try {
      duration = getDuration(presencesByGroup)
    } catch (_) {
      return null
    }

    const range = getRange()

    return { ...user, duration, range, role: 'membro' }
  })
}

function prepareCoordsToCertificate(coordsObjList, groupsObjList) {
  return coordsObjList.map(coordinator => {
    const { register, sex } = coordinator
    const range = getRange()
    const role = `coordenador${sex.toLowerCase() === 'feminino' ? 'a' : ''}`
    const duration =
      75 *
      groupsObjList.reduce((tot, { registers }) => {
        if (!registers) return tot
        return tot + registers.some(reg => +reg === +register)
      }, 0)

    if (duration === 0) return null
    return { ...coordinator, duration, range, role }
  })
}

export default function processCertificatesList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  // timestamp	formId	id	name	email	register	sex	cpf	phoneNumber	course	college	otherCollege	isRegular	semester	isNewbie	semestersInvolved	medium	topicsOfInterest	selectedGroup presences
  const [usersMatrix] = getSheetAsMatrix('Students', ss)
  const [usersObjList] = parseMatrixAsObject(usersMatrix)
  const usersToCertify = prepareUsersToCertificate(usersObjList)

  // register	cpf	email	name	social_name	sex	phoneNumber	course	semester	college
  const [coordsMatrix] = getSheetAsMatrix('Coord', ss)
  const [coordsObjList] = parseMatrixAsObject(coordsMatrix)
  const [groupsMatrix] = getSheetAsMatrix('Turmas', ss)
  const [groupsObjList] = parseMatrixAsObject(groupsMatrix)
  const coordsToCertify = prepareCoordsToCertificate(coordsObjList, groupsObjList)

  const certificatesList = [...usersToCertify, ...coordsToCertify]

  // name	email	register	cpf	course	college	range	duration	role	isCertificateSent
  const [certificatesMatrix, certificatesSheet] = getSheetAsMatrix('Certificates', ss)
  const [certificatesHeader] = certificatesMatrix

  // will erase current certificates list
  saveDataToSheet(certificatesSheet, certificatesList, certificatesHeader)
}

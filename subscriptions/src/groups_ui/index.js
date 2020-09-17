import MailField, { getMailFieldsReplacer } from '../mail/fields'
import sendEmail from '../mail/sendEmail'
import {
  getIndexedMapWithId,
  getSpreadsheetAsMatrix,
  parseMatrixAsObject
} from '../../../lib/parseSsData'
import { createGroupSheetFromTemplate, getMembersMatrix, populateGroupSheet } from './sheets'

export default function generateGroupsSpreadsheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  // timestamp	formId	id	name	email	register	sex	cpf	phoneNumber	course	college	otherCollege	isRegular	semester	isNewbie	semestersInvolved	medium	topicsOfInterest	selectedGroup
  const [usersMatrix, usersSheet] = getSpreadsheetAsMatrix('Students', ss)
  // id	vacancies	openVacancies	length	selected	leaders	title	specialty	description	weekDay	startsAt	endsAt	lang	preferenceByYear	preferenceByCollege
  const [groupsMatrix, groupsSheet] = getSpreadsheetAsMatrix('Turmas', ss)
  // register	cpf	email	name	social_name	sex	phoneNumber	course	semester	college
  const [coordsMatrix, coordsSheet] = getSpreadsheetAsMatrix('Coord', ss)

  const [usersObjList, usersHeader] = parseMatrixAsObject(usersMatrix)
  const [groupsObjList, groupsHeader] = parseMatrixAsObject(groupsMatrix)
  const [coordsObjList, coordsHeader] = parseMatrixAsObject(coordsMatrix)

  const usersMap = getIndexedMapWithId(usersObjList, 'register')
  const coordsMap = getIndexedMapWithId(coordsObjList, 'register')

  const groupsWithUsers = groupsObjList.map(({ selected, registers, ...groupObj }) => ({
    ...groupObj,
    members: selected.map(uid => usersMap.get(uid)),
    coordinators: registers.map(cid => coordsMap.get(cid))
  }))

  const mailFieldsReplacer = getMailFieldsReplacer(
    new MailField(
      '{{name}}, sua planilha de presenças',
      'Planilha de Presenças do Coordenador GEDAAM',
      'Caro coordenador, <a href="{{link}}" target="_blank">neste link</a> você poderá acessar a planilha de controle de membros. Para aprender como usá-la veja <a href="{{tutorial}}" target="_blank">este tutorial</a>'
    )
  )

  groupsWithUsers.map(group => {
    const membersMatrix = getMembersMatrix(group)
    const groupSheet = createGroupSheetFromTemplate(group)
    const id = groupSheet.getId()
    const ss = SpreadsheetApp.openById(id)
    populateGroupSheet(ss, membersMatrix)
    // const mergingFields = {
    //   ...mailFieldsReplacer({ ...group.coordinators, link: groupSheet.getUrl(), tutorial: '#' }),
    //   ...group.coordinators
    // }
    // sendEmail(mergingFields)
    return id
  })
}

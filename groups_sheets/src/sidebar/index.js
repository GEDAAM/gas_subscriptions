import { Config } from '../config'
import { addMember, getMembersNameReg, removeMember } from './memberCRUD'
import { showModal, alert } from './modals'

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

export default function showSubscriptionSidebar() {
  const [sheetId] = SpreadsheetApp.getActiveSpreadsheet().getName().split(' ')
  const htmlOutput = HtmlService.createTemplateFromFile(Config.HTML_SIDEBAR_NAME)
    .evaluate()
    .setTitle(`ID ${sheetId}`)

  SpreadsheetApp.getUi().showSidebar(htmlOutput)
}

global.include = include
global.showModal = showModal
global.alert = alert

global.getMembersNameReg = getMembersNameReg
global.addMember = addMember
global.removeMember = removeMember

import { fieldReplacer } from '../../../lib/general'

export function showModal(content) {
  const htmlTemplate = HtmlService.createTemplateFromFile('modal').evaluate().getContent()
  const replacedHtml = fieldReplacer({ content }, htmlTemplate)
  const htmlOutput = HtmlService.createHtmlOutput(replacedHtml)

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Configuração de membros')
}

export function alert(message) {
  SpreadsheetApp.getUi().alert(message)
}

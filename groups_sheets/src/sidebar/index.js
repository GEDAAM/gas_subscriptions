import { Config } from '../config'
import { fieldReplacer } from '../../../lib/general'

export default function showSubscriptionSidebar() {
  const sheetName = SpreadsheetApp.getActiveSpreadsheet().getName()
  const htmlTemplate = HtmlService.createTemplateFromFile(Config.HTML_SIDEBAR_NAME)
    .evaluate()
    .getContent()
  const htmlBody = fieldReplacer(
    {
      sheet_name: sheetName
    },
    htmlTemplate
  )
  const htmlOutput = HtmlService.createHtmlOutput(htmlBody).setTitle(sheetName)
  SpreadsheetApp.getUi().showSidebar(htmlOutput)
}

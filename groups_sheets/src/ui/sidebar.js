export default function showSubscriptionSidebar() {
  const htmlOutput = HtmlService.createHtmlOutput(
    `<p>${SpreadsheetApp.getActiveSpreadsheet().getName()}.</p>`
  ).setTitle('My add-on')
  SpreadsheetApp.getUi().showSidebar(htmlOutput)
}

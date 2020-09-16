/**
 * @OnlyCurrentDoc
 */

function showSubscriptionSidebar() {
  const htmlOutput = HtmlService.createHtmlOutput(
    '<p>A change of speed, a change of style...</p>'
  ).setTitle('My add-on')
  SpreadsheetApp.getUi().showSidebar(htmlOutput)
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('GEDAAM')
    .addItem('Inscrever membro', 'showSubscriptionSidebar')
    .addToUi()
  showSubscriptionSidebar()
}

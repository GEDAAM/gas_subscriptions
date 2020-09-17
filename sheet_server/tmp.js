function myFunction() {
  const content = ContentService.createTextOutput('')
  const ui  = SpreadsheetApp.getUi
  ui.showSidebar(content)
}

function onOpen() {
  myFunction()
}

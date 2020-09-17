export default function handleRequest(event, sheetName, withSheetCb) {
  const lock = LockService.getScriptLock()

  try {
    lock.waitLock(20000)
    const doc = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = doc.getSheetByName(sheetName)

    const res = withSheetCb(event, sheet)

    return ContentService.createTextOutput(
      JSON.stringify({ message: 'success', ...res })
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ message: 'error', error: err.message, auth: false })
    ).setMimeType(ContentService.MimeType.JSON)
  } finally {
    lock.releaseLock()
  }
}

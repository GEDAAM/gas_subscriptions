import { GetOperations } from './get'
import { PostOperations } from './post'

export function getWithSpreadsheet(event, ss) {
  const {
    parameter: { operation }
  } = event

  if (!(operation in GetOperations)) throw new Error('The provided operation is not supported.')

  return { [operation]: GetOperations[operation](ss) }
}

export function postWithSpreadsheet(event, ss) {
  const { postData } = event
  if (!postData.type.includes('json')) throw new Error('Invalid data type')
  if (postData.length <= 0) throw new Error('Empty payload')
  const { operation, ...payload } = JSON.parse(postData.contents)

  if (!(operation in PostOperations)) throw new Error('The provided operation is not supported.')

  return {
    data: PostOperations[operation](ss, payload)
  }
}

export default function handleRequest(event, withSpreadsheetCb) {
  const lock = LockService.getScriptLock()

  try {
    lock.waitLock(20000)
    const ss = SpreadsheetApp.getActiveSpreadsheet()

    const res = withSpreadsheetCb(event, ss)

    return ContentService.createTextOutput(
      JSON.stringify({ message: 'success', ...res })
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ message: 'error', error: err.message })
    ).setMimeType(ContentService.MimeType.JSON)
  } finally {
    lock.releaseLock()
  }
}

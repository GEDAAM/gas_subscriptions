import { getSheetAsMatrix, mapSpreadsheets } from '../../../lib/parseSsData'
import { Config } from '../groups_ui/config'

export function getGroupSheetsFromFolder() {
  const origin = DriveApp.getFolderById(Config.FOLDER_ID)
  const files = origin.getFiles()

  const indexedFiles = {}
  while (files.hasNext()) {
    const file = files.next()
    const fileId = file.getId()
    const [groupId] = file.getName().split(' ')
    indexedFiles[fileId] = groupId
  }

  return indexedFiles
}

export default function mapGroupsSpreadsheets() {
  const indexedFiles = getGroupSheetsFromFolder()
  const idList = Object.keys(indexedFiles)

  mapSpreadsheets(idList, ss => {
    const [, sheet] = getSheetAsMatrix('Membros', ss)
    const range = sheet.getRange('A1:A')
    const [, , h, ...data] = range.getValues()
    range.setValues([h, [''], ...data, ['']])
  })
}

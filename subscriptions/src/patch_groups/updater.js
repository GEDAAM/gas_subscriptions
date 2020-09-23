import { mapSpreadsheets, parseMatrixAsObject } from '../../../lib/parseSsData'
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

export default function getIndexedGroupsData() {
  const indexedFiles = getGroupSheetsFromFolder()
  const idList = Object.keys(indexedFiles)

  let groups = {}
  const internalSheetsList = mapSpreadsheets(idList, (ss, fileId) => {
    const groupId = indexedFiles[fileId]
    const controlSheet = ss.getSheetByName('Internal')
    const dataMatrix = controlSheet.getDataRange().getValues()
    const data = parseMatrixAsObject(dataMatrix)
    groups[groupId] = data

    return controlSheet
  })

  return [groups, internalSheetsList]
}

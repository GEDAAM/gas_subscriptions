import { Config } from './config'

export function getGroupName(group) {
  return `${group.id} - ${group.coordinators
    .map(c => {
      const [fn, ...nameArr] = c.name.split(' ')
      const ln = nameArr.pop()
      return `${fn} ${ln}`
    })
    .join(', ')}`
}

/**
 * @param {GoogleAppsScript.Drive.FileIterator} fileIterator
 */
export function trashPreviousFiles(fileIterator) {
  while (fileIterator.hasNext()) {
    fileIterator.next().setTrashed(true)
  }
}

export function getGroupSheetFile(group, recycle = true) {
  const destination = DriveApp.getFolderById(Config.FOLDER_ID)
  const fileName = getGroupName(group)
  const previousFiles = destination.getFilesByName(fileName)

  let file
  if (recycle && previousFiles.hasNext()) {
    file = previousFiles.next()
  } else {
    trashPreviousFiles(previousFiles)
    file = DriveApp.getFileById(Config.TEMPLATE_ID).makeCopy(fileName, destination)
  }

  const editors = !Config.TEST ? group.coordinators.map(c => c.email) : ['rafawendel2010@gmail.com']
  file.addEditors(editors)
  file.setShareableByEditors(false)

  return file
}

export function getGroupSheetId(group, idProp = 'sheet_id') {
  let id
  if (idProp in group && Config.RECYCLE_GROUP_SHEETS) {
    id = group.sheet_id
  } else {
    const groupSpreadsheetFile = getGroupSheetFile(group, Config.RECYCLE_GROUP_SHEETS)
    id = groupSpreadsheetFile.getId()
  }
  return id
}

export function getSortedMembers(group) {
  return group.members.sort(({ name: a }, { name: b }) => a.localeCompare(b))
}

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

export function createGroupSheetFromTemplate(group) {
  const destination = DriveApp.getFolderById(Config.FOLDER_ID)
  const fileName = getGroupName(group)
  const previousFiles = destination.getFilesByName(fileName)
  trashPreviousFiles(previousFiles)

  const file = DriveApp.getFileById(Config.TEMPLATE_ID)
    .makeCopy(fileName, destination)
    .setShareableByEditors(false)

  const editors = !Config.TEST ? group.coordinators.map(c => c.email) : ['rafawendel2010@gmail.com']
  file.addEditors(editors)

  return file
}

export function getMembersMatrix(group) {
  return group.members.map(member =>
    ['name', 'phoneNumber', 'semester', 'college', 'email'].map(prop => member[prop])
  )
}

export function populateGroupSheet(sheetId, membersMatrix) {
  const ss = SpreadsheetApp.openById(sheetId).getSheetByName(Config.MAIN_SHEET_NAME)
  ss.getRange(3, 1, membersMatrix.length, membersMatrix[0].length).setValues(membersMatrix)
}

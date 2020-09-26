import { addMember, removeMember } from './memberCRUD'

function mapRow(header, indexedData) {
  return header.map(h => {
    if (h === 'timestamp') return new Date()
    return JSON.stringify(indexedData[h])
  })
}

function setHeader(header, sheet) {
  const range = sheet.getRange(1, 1, 1, header.length)
  range.setValues([header])
}

function getHeader(sheet) {
  const dataRange = sheet.getDataRange()
  const [header] = dataRange.getValues()
  return header
}

function registerFormSubmission(ss, data) {
  const sheet = ss.getSheetByName('Form')
  const header = getHeader(sheet)
  const newHeader = [...header, ...Object.keys(data).filter(k => !header.includes(k))]
  setHeader(newHeader, sheet)
  const newRow = mapRow(newHeader, data)
  sheet.appendRow(newRow)

  return newRow
}

export const PostOperations = {
  submit: registerFormSubmission,
  add_member: addMember,
  remove_member: removeMember
}

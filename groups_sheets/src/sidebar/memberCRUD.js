const { DB_URL } = PropertiesService.getScriptProperties().getProperties()

function getRegisterFromNamereg(namereg) {
  return namereg.split('| ')[1]
}

export function getMembersNameReg() {
  const response = UrlFetchApp.fetch(`${DB_URL}?operation=nameregs`, {
    method: 'GET'
  })

  const { message, nameregs, error } = JSON.parse(response.getContentText())
  if (message !== 'success') throw new Error(error)

  return nameregs
}

export function addMember(namereg) {
  const currentSheetId = SpreadsheetApp.getActiveSpreadsheet().getId()
  const uid = getRegisterFromNamereg(namereg)

  const response = UrlFetchApp.fetch(DB_URL, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify({
      operation: 'add_member',
      currentSheetId,
      uid
    })
  })

  const { message, member, error } = JSON.parse(response.getContentText())
  console.log(JSON.parse(response.getContentText()), response)
  if (message !== 'success') throw new Error(error)
  console.log(member)

  return {
    message: 'Membro incluído com sucesso.'
  }
}

export function removeMember(namereg) {
  const currentSheetId = SpreadsheetApp.getActiveSpreadsheet().getId()
  const uid = getRegisterFromNamereg(namereg)

  const response = UrlFetchApp.fetch(DB_URL, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify({
      operation: 'remove_member',
      currentSheetId,
      uid
    })
  })

  const { message, member, error } = JSON.parse(response.getContentText())
  console.log(JSON.parse(response.getContentText()), response)
  if (message !== 'success') throw new Error(error)
  console.log(member)

  return {
    message: 'Membro removido com sucesso.'
  }
}

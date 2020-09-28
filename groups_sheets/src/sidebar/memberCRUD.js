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

function performOperationToMember(namereg, operation) {
  const currentSheetId = SpreadsheetApp.getActiveSpreadsheet().getId()
  const uid = getRegisterFromNamereg(namereg)

  const response = UrlFetchApp.fetch(DB_URL, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify({
      operation,
      currentSheetId,
      uid
    })
  }).getContentText()

  const { message, member, error } = JSON.parse(response)
  if (message !== 'success') throw new Error(error)

  return member
}

export function addMember(namereg) {
  performOperationToMember(namereg, 'add_member')
  return {
    message: 'Membro incluído com sucesso.'
  }
}

export function removeMember(namereg) {
  performOperationToMember(namereg, 'remove_member')
  return {
    message: 'Membro removido com sucesso.'
  }
}

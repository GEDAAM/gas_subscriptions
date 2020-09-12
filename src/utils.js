export function getSpreadsheetAsMatrix(sheetName, ss) {
  const spreadsheet = ss || SpreadsheetApp.getActiveSpreadsheet()
  const sheet = spreadsheet.getSheetByName(sheetName)
  const data = sheet.getDataRange().getValues()

  return [data, sheet]
}

export function parseMatrixAsObject(matrix) {
  const [header, ...data] = matrix
  const dataObjList = data.map(row =>
    row.reduce((rowObj, col, i) => {
      const h = header[i].trim().replace('\n', '')
      if (h && col) rowObj[h] = col.trim ? col.trim() : col
      return rowObj
    }, {})
  )

  return [dataObjList, header]
}

export function setDataToCleanSheet(sheet, dataObj, headers) {
  sheet.clear()
  const data = Object.values(dataObj).map(obj =>
    headers.map(h =>
      typeof obj[h] === 'object' ? JSON.stringify(obj[h]) : obj[h] && String(obj[h])
    )
  )
  sheet.getRange(1, 1, data.length + 1, headers.length).setValues([headers, ...data])
}

export function saveColumnToSpreadsheet(
  col,
  data,
  sheetName,
  offset = 1,
  ss = SpreadsheetApp.getActiveSpreadsheet()
) {
  const sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getActiveSheet()
  const destRange = sheet.getRange(offset + 1, col, data.length, 1)
  destRange.setValues(data.map(item => [item]))

  SpreadsheetApp.flush()
}

export function fieldReplacer(dataObj, text) {
  return Object.entries(dataObj).reduce(
    (replacedText, [key, value]) => replacedText.replace(new RegExp(`{{${key}}}`, 'g'), value),
    text
  )
}

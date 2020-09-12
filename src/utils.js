export function getSpreadsheetAsMatrix(sheetName, ss) {
  const spreadsheet = ss || SpreadsheetApp.getActiveSpreadsheet()
  const sheet =
    spreadsheet.getSheets().find(s => s.getName() === sheetName) ||
    spreadsheet.insertSheet(sheetName)
  const data = sheet.getDataRange().getValues()

  return [data, sheet]
}

export function isValidJSON(string) {
  if (!string) return false
  if (string.includes('{') || string.includes('[') || string.includes('"')) return true
  return false
}

export function parseRowWithHeaderProps(row, header) {
  return row.reduce((rowObj, cell, i) => {
    const h = header[i]
    if (h && cell) {
      rowObj[h] =
        typeof cell === 'string' ? (isValidJSON(cell) ? JSON.parse(cell) : cell.trim()) : cell
    }
    return rowObj
  }, {})
}

export function mapMatrixWithHeader(matrix, callback) {
  const [header, ...data] = matrix
  const cleanHeader = header.map(h => h.trim().replace('\n', ''))
  const mappedData = data.map(row => callback(row, cleanHeader))

  return [mappedData, header]
}

export function parseMatrixAsObject(matrix) {
  const [dataObjList] = mapMatrixWithHeader(matrix, parseRowWithHeaderProps)
  return dataObjList
}

export function getIndexedMapWithId(objList, idProp) {
  const map = new Map()
  objList.forEach(obj => {
    map.set(obj[idProp], obj)
  })

  return map
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

export function saveColumnsToIndexedSheet(ids, header, data, sheet) {
  ids.forEach((id, i) => {
    saveColumnToSheet(
      data.map(row => row[i]),
      header.indexOf(id) + 1,
      sheet
    )
  })
}

export function saveColumnToSheet(data, col, sheet, offset = 1) {
  const destRange = sheet.getRange(offset + 1, col, data.length, 1)
  destRange.setValues(data.map(item => [item]))
}

export function fieldReplacer(dataObj, text) {
  return Object.entries(dataObj).reduce(
    (replacedText, [key, value]) => replacedText.replace(new RegExp(`{{${key}}}`, 'g'), value),
    text
  )
}

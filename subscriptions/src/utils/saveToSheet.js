export function saveDataToCleanSheet(sheet, dataObj, headers) {
  sheet.clear()

  const mappable = 'map' in dataObj ? dataObj : Object.values(dataObj)
  const data = mappable
    .filter(obj => obj)
    .map(obj =>
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
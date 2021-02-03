import { isNullish } from './general'
import { getBottomRow } from './parseSsData'

export function formatToSpreadsheet(value) {
  if (isNullish(value)) return ''
  if (typeof value === 'object') {
    return value instanceof Date ? value : JSON.stringify(value)
  }
  return typeof value === 'number' ? String(value) : value
}

export function saveDataToSheet(sheet, dataObj, headers, clear = true) {
  const mappable = 'map' in dataObj ? dataObj : Object.values(dataObj)
  const data = mappable.filter(obj => obj).map(obj => headers.map(h => formatToSpreadsheet(obj[h])))

  if (clear) {
    sheet.clear({ contentsOnly: true })
    sheet.getRange(1, 1, data.length + 1, headers.length).setValues([headers, ...data])
  } else {
    const [prevHeader] = sheet.getDataRange().getValues()
    headers.forEach((header, i) => {
      // if header not found among previous, append a column (in a rather inefficient way)
      const column = prevHeader.indexOf(header) + 1 || prevHeader.length + 1
      sheet.getRange(1, column, data.length + 1, 1).setValues([[header], ...data.map(d => [d[i]])])
    })
  }
}

export function saveCellToSheet(sheet, row, col, data) {
  const destRange = sheet.getRange(row, col, 1, 1)
  destRange.setValues([[data]])
}

export function saveColumnToSheet(data, col, sheet, offset = 1) {
  const destRange = sheet.getRange(offset + 1, col, data.length, 1)
  destRange.setValues(data.map(item => [item]))
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

export function removeRowByIndex(sheet, rowIndex) {
  const secondToLastRow = getBottomRow(sheet)
  sheet.appendRow([null])
  secondToLastRow.copyTo(getBottomRow(sheet))
  sheet.deleteRow(rowIndex)
}

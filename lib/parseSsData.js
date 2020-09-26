export function getSheetAsMatrix(sheetName, ss) {
  const spreadsheet = ss || SpreadsheetApp.getActiveSpreadsheet()
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName)
  const data = sheet.getDataRange().getValues()

  return [data, sheet]
}

/**
 * @param {string[]} idList
 * @param {callback} callback
 * @callback callback
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @param {string} id
 */
export function mapSpreadsheets(idList, callback) {
  return idList.map(id => {
    const ss = SpreadsheetApp.openById(id)
    return callback(ss, id)
  })
}

export function parseRowWithHeaderProps(row, header) {
  return row.reduce((rowObj, cell, i) => {
    const h = header[i]
    if (h && cell) {
      if (typeof cell === 'string') {
        try {
          rowObj[h] = JSON.parse(cell)
        } catch (_e) {
          rowObj[h] = cell.trim()
        }
      } else {
        rowObj[h] = cell
      }
    }
    return rowObj
  }, {})
}

export function mapMatrixWithHeader(matrix, callback) {
  const [header, ...data] = matrix
  const cleanHeader = header.map(h => (h.trim ? h.trim().replace('\n', '') : h))
  const mappedData = data.map(row => callback(row, cleanHeader))

  return [mappedData, cleanHeader]
}

export function parseMatrixAsObject(matrix) {
  const [dataObjList, header] = mapMatrixWithHeader(matrix, parseRowWithHeaderProps)
  return [dataObjList, header]
}

export function getIndexedMapWithId(objList, idProp) {
  const map = new Map()
  objList.forEach(obj => {
    map.set(obj[idProp], obj)
  })

  return map
}

export function findSheetByName(sheetName, ss) {
  return ss.getSheets().find(sheet => sheet.getName() === sheetName)
}

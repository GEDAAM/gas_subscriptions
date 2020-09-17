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

export default function postWithFormSheet(event, sheet) {
  const { postData } = event
  if (!postData.type.includes('json')) throw new Error('Invalid data type')
  if (postData.length <= 0) throw new Error('Empty payload')
  const payload = JSON.parse(postData.contents)

  const header = getHeader(sheet)
  const newHeader = [...header, ...Object.keys(payload).filter(k => !header.includes(k))]
  setHeader(newHeader, sheet)
  const newRow = mapRow(newHeader, payload)
  sheet.appendRow(newRow)

  return {}
}

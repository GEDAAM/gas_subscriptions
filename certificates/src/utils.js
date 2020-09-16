// @param {array} range = [row, column, numRows, numColumns] OR [row, column, numColumns] OR [row, column]
export function parseSpreadsheetAsObject(
  range = [1, 1, 1, 1],
  sheetName,
  ss = SpreadsheetApp.getActiveSpreadsheet()
) {
  const sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getActiveSheet();

  if (range.length === 2)
    range = [...range, sheet.getDataRange().getLastRow(), sheet.getDataRange().getLastColumn()];
  if (range.length === 3) range = [range[0], range[1], sheet.getDataRange().getLastRow(), range[2]];
  const [header, ...data] = sheet.getRange(...range).getValues();

  const dataObjList = data.map(row =>
    row.reduce(
      (tot, col, i) =>
        header[i] && header[i] !== '\n'
          ? { ...tot, [header[i]]: col.trim ? col.trim() : col }
          : tot,
      {}
    )
  );

  return dataObjList;
}

export function saveColumnToSpreadsheet(
  col,
  data,
  sheetName,
  offset = 1,
  ss = SpreadsheetApp.getActiveSpreadsheet()
) {
  const sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getActiveSheet();
  const destRange = sheet.getRange(offset + 1, col, data.length, 1);
  destRange.setValues(data.map(item => [item]));

  SpreadsheetApp.flush();
}

export function fieldReplacer(dataObj, text) {
  return Object.entries(dataObj).reduce(
    (replacedText, [key, value]) => replacedText.replace(new RegExp(`{{${key}}}`, 'g'), value),
    text
  );
}

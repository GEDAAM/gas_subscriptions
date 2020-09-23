export function addGroupSheetTriggers(spreadsheet) {
  const triggers = [
    {
      name: 'fn', // should add sidebar
      callback: builder => builder.forSpreadsheet(spreadsheet).onOpen()
    },
    {
      name: 'fn', // should update reserved sheet
      callback: builder => builder.forSpreadsheet(spreadsheet).onEdit()
    }
  ]
  deleteTriggers(spreadsheet)
  mapTriggers(triggers)
}

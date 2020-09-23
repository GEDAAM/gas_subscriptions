import { mapTriggers } from '../../lib/triggers'

export default function addGroupSheetTriggers(spreadsheet) {
  const triggers = [
    {
      name: 'myOnOpen', // show sidebar and add menu
      callback: builder => builder.forSpreadsheet(spreadsheet).onOpen()
    }
    // ,{
    //   name: 'myOnEdit', // update reserved sheet
    //   callback: builder => builder.forSpreadsheet(spreadsheet).onEdit()
    // }
  ]
  mapTriggers(triggers)
}

import { deleteTriggers, mapTriggers } from '../../lib/triggers'

const TRIGGERABLE_FUNCTIONS = [
  // {
  //   name: 'sendGroupsDataToServer',
  //   // (GoogleAppsScript.Script.TriggerBuilder) => GoogleAppsScript.Script.Trigger
  //   callback: trigger => trigger.timeBased().everyHours(1)
  // }
  {
    name: 'updateUserPresences',
    callback: builder => builder.timeBased().atHour(0).everyDays(1)
  }
]

export default function triggersSetup() {
  deleteTriggers()
  mapTriggers(TRIGGERABLE_FUNCTIONS)
}

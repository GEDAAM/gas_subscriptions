import { deleteTriggers, mapTriggers } from '../../lib/triggers/index'

const TRIGGERABLE_FUNCTIONS = [
  // {
  //   name: 'sendGroupsDataToServer',
  //   // (GoogleAppsScript.Script.TriggerBuilder) => GoogleAppsScript.Script.Trigger
  //   callback: trigger => trigger.timeBased().everyHours(1)
  // }
]

export default function triggersSetup() {
  deleteTriggers()
  mapTriggers(TRIGGERABLE_FUNCTIONS)
}

export const TriggerTypes = {
  TIME_BASED: 'timeBased'
}

const TRIGGERABLE_FUNCTIONS = [
  {
    name: 'sendGroupsDataToServer',
    type: TriggerTypes.TIME_BASED,
    // (GoogleAppsScript.Script.[GASTriggerType]) => GoogleAppsScript.Script.Trigger
    callback: trigger => trigger.everyHours(1)
  }
]

function deleteTriggers() {
  const triggers = ScriptApp.getProjectTriggers()
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger)
  })
}

export default function triggersSetup() {
  deleteTriggers()
  TRIGGERABLE_FUNCTIONS.forEach(({ name, type, callback }) => {
    callback(ScriptApp.newTrigger(name)[type]()).create()
  })
}

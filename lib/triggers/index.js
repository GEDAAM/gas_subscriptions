export function deleteTriggers(type = null, doc = null) {
  const triggers = doc ? ScriptApp.getUserTriggers(doc) : ScriptApp.getProjectTriggers()
  triggers.forEach(trigger => {
    if (!type || trigger.getTriggerSource() === type) {
      ScriptApp.deleteTrigger(trigger)
    }
  })
}

export function mapTriggers(triggersList) {
  return triggersList.map(({ name, callback }) => {
    callback(ScriptApp.newTrigger(name)).create()
  })
}

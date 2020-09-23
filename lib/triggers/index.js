export function deleteTriggers(doc = null) {
  const triggers = doc ? ScriptApp.getUserTriggers(doc) : ScriptApp.getProjectTriggers()
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger)
  })
}

export function mapTriggers(triggersList) {
  return triggersList.map(({ name, callback }) => {
    callback(ScriptApp.newTrigger(name)).create()
  })
}

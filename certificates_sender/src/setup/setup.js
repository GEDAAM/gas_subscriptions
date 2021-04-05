import { Config } from '../config'

const Defaults = {
  TEST: Config.TEST,
  CERTIFICATE_SHEET_NAME: 'Certificados',
  NAME_COLUMN: 'name',
  EMAIL_COLUMN: 'email',
  VERIFY_COLUMN: 'is_done',
  MAX_RUNNING_TIME: 5 * 60 * 1000, // in milliseconds
  BACKUP_CERTIFICATES: true
}

function getUserInput(promptMapping, title) {
  const ui = SpreadsheetApp.getUi()
  const responseMapping = {}

  for (const key in promptMapping) {
    const prompt = promptMapping[key]
    const response = ui.prompt(title, prompt, ui.ButtonSet.OK_CANCEL)

    const btn = response.getSelectedButton()
    if (btn === ui.Button.CANCEL || btn === ui.Button.CANCEL) break

    const input = response.getResponseText()
    responseMapping[key] = input
  }

  return responseMapping
}

// Abstract class
export default class Setup {
  properties = PropertiesService.getDocumentProperties() || PropertiesService.getScriptProperties()

  title = ''
  clearProperties = false

  requiredPrompts = {}
  optionalPrompts = {}

  static start(overhead = {}) {
    const settings = {
      ...Defaults,
      ...getUserInput(this.requiredPrompts, this.title),
      ...getUserInput(this.optionalPrompts, `${this.title} (deixe em branco para ignorar)`),
      ...overhead
    }

    this.properties.setProperties(settings, this.clearProperties)
  }
}

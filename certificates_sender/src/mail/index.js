import { Config } from './config'
import { fieldReplacer } from '../../../lib/general'

const Settings = (
  PropertiesService.getDocumentProperties() || PropertiesService.getScriptProperties()
).getProperties()

export class MailError extends Error {
  constructor(message, isQuotaExceeded, userName) {
    super(message)
    this.isQuotaExceeded = isQuotaExceeded
    this.userName = userName
  }
}

export default function sendEmail(mergingFields, attachment, replyToSuffix = '') {
  if (MailApp.getRemainingDailyQuota() < 1) {
    throw new MailError('A cota de emails diária se esgotou', true)
  }

  const htmlTemplate = HtmlService.createTemplateFromFile(Config.EMAIL_HTML)
    .evaluate()
    .getContent()
    .toString()

  const htmlBody = fieldReplacer(mergingFields, htmlTemplate)
  let { email, name, subject, intro, body } = mergingFields
  if (Config.TEST) email = Settings.SENDER_EMAIL

  const mailOptions = {
    attachments: [attachment],
    from: Settings.SENDER_EMAIL,
    name: Settings.SENDER_NAME,
    replyTo: replyToSuffix
      ? Settings.SENDER_EMAIL.replace('@', `+${replyToSuffix}@`)
      : Settings.SENDER_EMAIL,
    htmlBody
  }

  try {
    GmailApp.sendEmail(email, subject, `${intro}\n\n${body}`, mailOptions)
  } catch (_err) {
    try {
      MailApp.sendEmail(email, subject, `${intro}\n\n${body}`, mailOptions)
    } catch (error) {
      throw new MailError(error, false, name)
    }
  }

  return true
}

import { Defaults } from './config'
import { fieldReplacer } from '../../../lib/general'

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

  const htmlTemplate = HtmlService.createTemplateFromFile(Defaults.EMAIL_HTML)
    .evaluate()
    .getContent()
    .toString()

  const htmlBody = fieldReplacer(mergingFields, htmlTemplate)
  let { email, name, subject, intro, body } = mergingFields
  if (Defaults.TEST) email = Defaults.TEST_EMAIL

  const mailOptions = {
    attachments: [attachment],
    from: 'coordenacaogedaam+ti@gmail.com',
    name: 'GEDAAM: Dpto. de TI',
    replyTo: `coordenacaogedaam${replyToSuffix ? `+${replyToSuffix}` : ''}@gmail.com`,
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

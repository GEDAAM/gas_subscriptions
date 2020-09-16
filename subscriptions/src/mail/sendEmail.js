import { Config } from '../groups_ui/config'
import { fieldReplacer } from '../utils/general'

export default function sendEmail(mergingFields, attachment, replyToSuffix = '') {
  if (MailApp.getRemainingDailyQuota() < 1) throw new Error('A cota de emails diária se esgotou\n')

  const htmlTemplate = HtmlService.createTemplateFromFile(Config.EMAIL_HTML)
    .evaluate()
    .getContent()
    .toString()

  const htmlBody = fieldReplacer(mergingFields, htmlTemplate)
  let { email, name, subject, intro, body } = mergingFields
  if (Config.TEST) email = 'rafawendel2010@gmail.com'

  try {
    GmailApp.sendEmail(email, subject, `${intro}\n\n${body}`, {
      attachments: [attachment],
      from: 'coordenacaogedaam+ti@gmail.com',
      name: 'GEDAAM: Dpto. de TI',
      replyTo: `coordenacaogedaam${replyToSuffix ? `+${replyToSuffix}` : ''}@gmail.com`,
      htmlBody
    })

    return true
  } catch (_err) {
    try {
      MailApp.sendEmail(email, subject, `${intro}\n\n${body}`, {
        attachments: [attachment],
        from: 'coordenacaogedaam+ti@gmail.com',
        name: 'GEDAAM: Diretoria de TI',
        replyTo: `coordenacaogedaam${replyToSuffix ? `+${replyToSuffix}` : ''}@gmail.com`,
        htmlBody
      })

      return true
    } catch (error) {
      throw new Error(`O e-mail de ${name} não foi enviado. Erro ${error}\n`)
    }
  }
}
export default function sendEmail(mergingFields, htmlBody, attachment, replyToSuffix = '') {
  if (MailApp.getRemainingDailyQuota() < 1) throw new Error('A cota de emails diária se esgotou\n');

  const { email, name, subject, intro, body } = mergingFields;

  try {
    GmailApp.sendEmail(email, subject, `${intro}\n\n${body}`, {
      attachments: [attachment],
      from: 'coordenacaogedaam+ti@gmail.com',
      name: 'GEDAAM: Dpto. de TI',
      replyTo: `coordenacaogedaam${replyToSuffix ? `+${replyToSuffix}` : ''}@gmail.com`,
      htmlBody
    });

    return true;
  } catch (_err) {
    try {
      MailApp.sendEmail(email, subject, `${intro}\n\n${body}`, {
        attachments: [attachment],
        from: 'coordenacaogedaam+ti@gmail.com',
        name: 'GEDAAM: Dpto. de TI',
        replyTo: `coordenacaogedaam${replyToSuffix ? `+${replyToSuffix}` : ''}@gmail.com`,
        htmlBody
      });

      return true;
    } catch (error) {
      throw new Error(`O e-mail de ${name} não foi enviado. Erro ${error}\n`);
    }
  }
}

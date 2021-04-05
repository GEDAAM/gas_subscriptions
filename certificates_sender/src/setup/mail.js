import Setup from './setup'

class EmailSetup extends Setup {
  title = 'Configurando e-mails'
  clearProperties = false

  requiredPrompts = {
    SENDER_EMAIL: 'Insira o e-mail do remetente',
    SENDER_NAME: 'Insira o nome do remetente'
  }

  optionalPrompts = {
    EMAIL_COLUMN: 'Insira o título do cabeçalho para a coluna dos e-mails'
  }
}

export default function setupEmail() {
  EmailSetup.start({
    SHOULD_SEND_EMAIL: true
  })
}

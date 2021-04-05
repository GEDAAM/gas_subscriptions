import Setup from './setup'

class MainSetup extends Setup {
  title = 'Configurando certificações'
  clearProperties = true

  requiredPrompts = {
    CERTIFICATE_FOLDER_URL: 'Insira o link para a pasta na qual os certificados serão salvos',
    CERTIFICATE_SLIDE_TEMPLATE_URL: 'Insira o link da apresentação que será usada como modelo'
  }

  optionalPrompts = {
    NAME_COLUMN: 'Insira o título do cabeçalho para a coluna dos nomes',
    EMAIL_COLUMN: 'Insira o título do cabeçalho para a coluna dos e-mails',
    VERIFY_COLUMN: 'Insira o título do cabeçalho para a coluna de verificação'
  }
}

export default function setupApp() {
  MainSetup.start()
}

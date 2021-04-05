import sendCertificates from './certificates'
import setupApp from './setup'
import setupEmail from './setup/mail'

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Certificados')
    .addItem('Configuração', 'setupApp')
    .addItem('Configurar e-mails', 'setupEmail')
    .addItem('Gerar / Enviar', 'sendCertificates')
    .addToUi()
}

global.setupApp = setupApp
global.setupEmail = setupEmail

global.sendCertificates = sendCertificates

global.onOpen = onOpen

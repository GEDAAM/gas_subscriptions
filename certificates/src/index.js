import generateAndSendCertificatesFromSpreadsheet from './certificates';

function onOpen(_e) {
  SpreadsheetApp.getUi()
    .createMenu('Gerar')
    .addItem('Certificados', 'certificates')
    .addToUi();
}

global.certificates = generateAndSendCertificatesFromSpreadsheet;
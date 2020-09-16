import sendEmail from './mail/sendEmail'
import { parseSpreadsheetAsObject, saveColumnToSpreadsheet, fieldReplacer } from './utils';

function generateCertificateFromSlide(
  certificateObj,
  templateId,
  backup = { store: false, folderId: Defaults.CERTIFICATE_FOLDER_ID },
  isTest = Defaults.TEST
) {
  const targetFile = DriveApp.getFileById(templateId).makeCopy(
    `Certificado de ${certificateObj.name}.pdf`
  );
  const targetDocument = SlidesApp.openById(targetFile.getId());
  const targetSlide = targetDocument.getSlides()[0];

  Object.entries(certificateObj).forEach(([key, value]) => {
    targetSlide.replaceAllText(`{{${key}}}`, value);
  });
  targetDocument.saveAndClose();
  const blob = targetFile.getAs('application/pdf').copyBlob();

  if (backup.store && !isTest) {
    const targetFolder = DriveApp.getFolderById(backup.folderId);
    const oldFiles = targetFolder.getFilesByName(targetFile.getName());

    while (oldFiles.hasNext()) {
      const trashFile = oldFiles.next();
      trashFile.setTrashed(true);
    }

    targetFolder.createFile(blob);
  }

  targetFile.setTrashed(true);

  return blob;
}

function mapAndSendCertificates(
  certificateObjList,
  certificateSlideTemplateId,
  htmlTemplate,
  mailFields,
  verificationArr,
  isTest = Defaults.TEST,
  defaultEmail = Defaults.EMAIL
) {
  let indexOfLastSuccess = 0;
  certificateObjList.forEach(certificateObj => {
    if (isTest) certificateObj.email = defaultEmail;
    certificateObj.fname = certificateObj.name.split(' ')[0];

    const certificateAttachment = generateCertificateFromSlide(
      certificateObj,
      certificateSlideTemplateId
    );

    const replacedMailFields = Object.entries(mailFields).reduce(
      (newObj, [key, value]) => ({ ...newObj, [key]: fieldReplacer(certificateObj, value) }),
      {}
    );

    const htmlBody = fieldReplacer(replacedMailFields, htmlTemplate);

    const hasSentEmail = sendEmail(
      { ...certificateObj, ...replacedMailFields },
      htmlBody,
      certificateAttachment
    );
    indexOfLastSuccess = verificationArr.indexOf(false, indexOfLastSuccess);
    verificationArr[indexOfLastSuccess] = hasSentEmail;
  });
}

// eslint-disable-next-line no-unused-vars
export default function generateAndSendCertificatesFromSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet(); // openById('125JkbJjN6nIJN7050iyg3ZPXpA_WFtZ3f36e2n4iPPE')
  const certificateSheetName = 'Certificados';
  const mailHtmlTemplateName = 'mail.html';
  const certificateSlideTemplateId = '1AT2vn1vJUywGz8767zggBlbGUlOCZZnW5STaVTAFVd0';

  // student_id	name	university	role	range	duration	course	email	sent?
  const studentsCertificateObjList = parseSpreadsheetAsObject([1, 1, 9], certificateSheetName, ss);
  const newCertificateEntriesList = studentsCertificateObjList.filter(obj => !obj['sent?']);
  const verificationColumn = studentsCertificateObjList.map(obj => !!obj['sent?']);

  const mailFields = {
    subject: '{{fname}}, seu certificado do GEDAAM!',
    intro: 'Olá {{fname}}, tudo bem? Tomara!',
    title: 'Temos uma boa notícia!',
    teaser: 'Sim, seu certificado de {{range}} está pronto!',
    body:
      '   A equipe de Coordenação do GEDAAM se felicita em enviar-lhe seu certificado de {{duration}} relativo ao período de {{range}}. \n\n Obrigado por participar!',
    description: 'Você pode baixá-lo no anexo.',
    preview: 'Olá {{fname}}, tudo bem? Tomara! Sim, seu certificado de {{range}} está pronto!',
    year: new Date().getFullYear().toString()
  };

  let alertMessage = '';
  try {
    const htmlTemplate = HtmlService.createTemplateFromFile(mailHtmlTemplateName)
      .evaluate()
      .getContent()
      .toString();
    mapAndSendCertificates(
      newCertificateEntriesList,
      certificateSlideTemplateId,
      htmlTemplate,
      mailFields,
      verificationColumn
    );
    alertMessage = 'Todos os certificados foram gerados com sucesso';
  } catch (error) {
    console.log(error);
    alertMessage = `${error.message}... Interrompendo execução.`;
  } finally {
    saveColumnToSpreadsheet(9, verificationColumn);
    SpreadsheetApp.getUi().alert(alertMessage).OK;
  }
}

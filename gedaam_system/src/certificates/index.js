import { forEach } from 'lodash'
import { getSheetAsMatrix, parseMatrixAsObject } from '../../../lib/parseSsData'
import sendEmail from '../mail'
import { Defaults } from './config'
import { parseSpreadsheetAsObject, saveColumnToSpreadsheet, fieldReplacer } from './utils'

const isTest = Defaults.TEST
function generateCertificateFromSlide(certificateObj, eraseOld = true) {
  const targetFile = DriveApp.getFileById(Defaults.CERTIFICATE_SLIDE_TEMPLATE_ID).makeCopy(
    `Certificado de ${certificateObj.name}.pdf`
  )
  const targetDocument = SlidesApp.openById(targetFile.getId())
  const targetSlide = targetDocument.getSlides()[0]

  forEach(certificateObj, (key, value) => {
    targetSlide.replaceAllText(`{{${key}}}`, value)
  })

  targetDocument.saveAndClose()
  const blob = targetFile.getAs('application/pdf').copyBlob()

  if (!eraseOld && !isTest) {
    const targetFolder = DriveApp.getFolderById(Defaults.CERTIFICATE_FOLDER_ID)
    const oldFiles = targetFolder.getFilesByName(targetFile.getName())

    while (oldFiles.hasNext()) {
      const trashFile = oldFiles.next()
      trashFile.setTrashed(true)
    }

    targetFolder.createFile(blob)
  }

  targetFile.setTrashed(true)

  return blob
}

function mapAndSendCertificates(certificateObjList, htmlTemplate, mailFields, verificationArr) {
  let indexOfLastSuccess = 0
  certificateObjList.forEach(certificateObj => {
    if (isTest) certificateObj.email = Defaults.EMAIL
    certificateObj.fname = certificateObj.name.split(' ')[0]

    const certificateAttachment = generateCertificateFromSlide(certificateObj)

    const replacedMailFields = Object.entries(mailFields).reduce(
      (newObj, [key, value]) => ({ ...newObj, [key]: fieldReplacer(certificateObj, value) }),
      {}
    )

    const htmlBody = fieldReplacer(replacedMailFields, htmlTemplate)

    const hasSentEmail = sendEmail(
      { ...certificateObj, ...replacedMailFields },
      htmlBody,
      certificateAttachment
    )
    indexOfLastSuccess = verificationArr.indexOf(false, indexOfLastSuccess)
    verificationArr[indexOfLastSuccess] = hasSentEmail
  })
}

// eslint-disable-next-line no-unused-vars
export default function generateAndSendCertificates() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  // name	email	register	cpf	course	college	range	duration	role	isCertificateSent
  const [certificatesMatrix, certificatesSheet] = getSheetAsMatrix('Certificates', ss)
  const [certificatesObjList] = parseMatrixAsObject(certificatesMatrix)

  const newCertificateEntriesList = studentsCertificateObjList.filter(obj => !obj['sent?'])
  const verificationColumn = studentsCertificateObjList.map(obj => !!obj['sent?'])

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
  }

  let alertMessage = ''
  try {
    mapAndSendCertificates(newCertificateEntriesList, mailFields, verificationColumn)
    alertMessage = 'Todos os certificados foram gerados com sucesso'
  } catch (error) {
    console.log(error)
    alertMessage = `${error.message}... Interrompendo execução.`
  } finally {
    saveColumnToSpreadsheet(9, verificationColumn)
    SpreadsheetApp.getUi().alert(alertMessage).OK
  }
}

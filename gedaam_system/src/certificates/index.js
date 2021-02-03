import { forEach, reduce } from 'lodash'
import { fieldReplacer } from '../../../lib/general'
import { getSheetAsMatrix, parseMatrixAsObject } from '../../../lib/parseSsData'
import { saveColumnToSheet } from '../../../lib/saveToSheet'
import sendEmail from '../mail'
import { Defaults } from './config'

function generateCertificateFromSlide(certificateObj) {
  const targetFile = DriveApp.getFileById(Defaults.CERTIFICATE_SLIDE_TEMPLATE_ID).makeCopy(
    `Certificado de ${certificateObj.name}.pdf`
  )
  const targetDocument = SlidesApp.openById(targetFile.getId())
  const targetSlide = targetDocument.getSlides()[0]

  forEach(certificateObj, (value, key) => {
    targetSlide.replaceAllText(`{{${key}}}`, value)
  })

  targetDocument.saveAndClose()
  const blob = targetFile.getAs('application/pdf').copyBlob()

  if (Defaults.BACKUP_CERTIFICATES && !Defaults.TEST) {
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

function mapAndSendCertificates(certificateObjList, mailFields) {
  let certificateDidSendList = Array(certificateObjList.length).fill(false)
  const erroredUsers = []

  for (let i = 0; i < certificateObjList.length; i++) {
    const certificateObj = certificateObjList[i]
    if (certificateObj.isCertificateSent) {
      certificateDidSendList[i] = true
      continue
    }

    certificateObj.fname = certificateObj.name.split(' ')[0]

    const certificate = generateCertificateFromSlide(certificateObj)

    const replacedMailFields = reduce(
      mailFields,
      (newObj, value, key) => ({ ...newObj, [key]: fieldReplacer(certificateObj, value) }),
      {}
    )

    try {
      certificateDidSendList[i] = sendEmail(
        { ...certificateObj, ...replacedMailFields },
        certificate
      )
    } catch (err) {
      console.error(err)
      if (err.isQuotaExceeded) {
        // do some trigger management
        break
      }

      if (err.userName) erroredUsers.push(err.userName)
    }
  }

  return [certificateDidSendList, erroredUsers]
}

export default function sendCertificates() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  // name	email	register	cpf	course	college	range	duration	role	isCertificateSent
  const [certificatesMatrix, certificatesSheet] = getSheetAsMatrix('Certificates', ss)
  const [certificatesObjList, certificatesHeader] = parseMatrixAsObject(certificatesMatrix)

  const mailFields = {
    subject: '{{fname}}, seu certificado do GEDAAM!',
    intro: 'Olá {{fname}}, tudo bem? Tomara!',
    title: 'Temos uma boa notícia!',
    teaser: 'Sim, seu certificado de {{range}} está pronto!',
    body:
      '   A equipe de Coordenação do GEDAAM se felicita em enviar-lhe seu certificado de {{duration}} horas relativo ao período de {{range}}. <br/><br/> Obrigado por participar!',
    description: 'Você pode baixá-lo no anexo.',
    preview: 'Olá {{fname}}, tudo bem? Tomara! Sim, seu certificado de {{range}} está pronto!',
    year: new Date().getFullYear().toString()
  }

  const [certificateDidSendList, erroredUsers] = mapAndSendCertificates(
    certificatesObjList,
    mailFields
  )

  saveColumnToSheet(
    certificateDidSendList,
    certificatesHeader.indexOf('isCertificateSent') + 1,
    certificatesSheet
  )
  SpreadsheetApp.flush()

  const ui = SpreadsheetApp.getUi()
  if (!certificateDidSendList.includes(false)) {
    ui.alert('Todos os certificados foram gerados com sucesso')
  } else if (erroredUsers.length > 0) {
    ui.alert(
      `Os certificados de ${erroredUsers.join('\n')} não puderam ser enviados por erro interno.`
    )
  } else {
    ui.alert('Alguns certificados ainda não puderam ser gerados, tente novamente mais tarde.')
  }
}

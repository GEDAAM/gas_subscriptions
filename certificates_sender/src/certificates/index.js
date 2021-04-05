import { forEach, reduce } from 'lodash'
import { fieldReplacer, getIdFromUrl } from '../../../lib/general'
import { getSheetAsMatrix, parseMatrixAsObject } from '../../../lib/parseSsData'
import { saveCellToSheet } from '../../../lib/saveToSheet'
import { parseName } from '../../../lib/parseName'
import { Config } from './config'
import sendEmail from '../mail'

const Settings = (
  PropertiesService.getDocumentProperties() || PropertiesService.getScriptProperties()
).getProperties()

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

// Generating certificates typically takes more time than the allowed quota
const startTime = new Date().getTime()
let timeoutFlag = false
let quotaFlag = false

function setQuotaTrigger() {
  // As mail quotas reset every 24 hours, this will set the script to trigger after that time
  ScriptApp.newTrigger('sendCertificates')
    .timeBased()
    .after(24.1 * 60 * 60 * 1000) // waits 24 hours (com uma gordurinha)
    .create()
}

function setTimeoutTrigger() {
  ScriptApp.newTrigger('sendCertificates')
    .timeBased()
    .after(60 * 1000) // waits a minute
    .create()
}

function generateCertificateFromSlide(certificateObj) {
  const targedId = getIdFromUrl(Settings.CERTIFICATE_SLIDE_TEMPLATE_URL)
  const targetFile = DriveApp.getFileById(targedId).makeCopy(
    `Certificado de ${certificateObj.name}.pdf`
  )
  const targetDocument = SlidesApp.openById(targedId)
  const targetSlide = targetDocument.getSlides()[0]

  forEach(certificateObj, (value, key) => {
    targetSlide.replaceAllText(`{{${key}}}`, value)
  })

  targetDocument.saveAndClose()
  const blob = targetFile.getAs('application/pdf').copyBlob()

  if (Config.BACKUP_CERTIFICATES && !Config.TEST) {
    const targetFolder = DriveApp.getFolderById(getIdFromUrl(Settings.CERTIFICATE_FOLDER_URL))
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

function mapAndSendCertificates(certificateObjList, saveCellByRow) {
  let certificateDidSendList = Array(certificateObjList.length).fill(false)
  const erroredUsers = []

  for (let i = 0; i < certificateObjList.length; i++) {
    const certificateObj = certificateObjList[i]
    if (certificateObj[Settings.VERIFY_COLUMN]) {
      certificateDidSendList[i] = true
      continue
    }

    certificateObj.name = parseName(certificateObj[Settings.NAME_COLUMN])
    certificateObj.fname = certificateObj.name.split(' ')[0]
    certificateObj.email = certificateObj[Settings.EMAIL_COLUMN]

    const certificate = generateCertificateFromSlide(certificateObj)

    if (Settings.SHOULD_SEND_EMAIL) {
      const replacedMailFields = reduce(
        mailFields,
        (newObj, value, key) => ({
          ...newObj,
          [key]: fieldReplacer(certificateObj, value)
        }),
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
          setQuotaTrigger()
          quotaFlag = true
          break
        }

        if (err.userName) erroredUsers.push(err.userName)
      }

      saveCellByRow(certificateDidSendList[i], i)
    } else {
      saveCellByRow(true, i)
    }

    // In case this takes longer than the allowed quota to run, breaks and sets trigger
    const currTime = new Date().getTime()
    if (currTime - startTime >= Config.MAX_RUNNING_TIME) {
      setTimeoutTrigger()
      timeoutFlag = true
      break
    }
  }

  return [certificateDidSendList, erroredUsers]
}

export default function sendCertificates() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  const [certificatesMatrix, certificatesSheet] = getSheetAsMatrix(
    Settings.CERTIFICATE_SHEET_NAME || ss.getActiveSheet().getName(),
    ss
  )
  const [certificatesObjList, certificatesHeader] = parseMatrixAsObject(certificatesMatrix)

  const saveCellByRow = (data, row) => {
    saveCellToSheet(
      certificatesSheet,
      row + 2, // starts at 1, first is header
      certificatesHeader.indexOf(Settings.VERIFY_COLUMN) + 1 || certificatesHeader.length,
      data
    )
  }

  // this can take longer than standard runtime limits to run
  const [certificateDidSendList, erroredUsers] = mapAndSendCertificates(
    certificatesObjList,
    saveCellByRow
  )

  // Only update if the session is being run by an actual user
  try {
    const ui = SpreadsheetApp.getUi()
    SpreadsheetApp.flush()

    if (erroredUsers.length > 0) {
      ui.alert(
        `Os certificados de ${erroredUsers.join('\n')} não puderam ser enviados por erro interno.`
      )
    } else if (timeoutFlag) {
      ui.alert(
        'O certificados demoraram demais para serem gerados. Interrompendo e reiniciando em 1 minuto...'
      )
    } else if (quotaFlag) {
      ui.alert(
        'A quantidade de certificados excedeu a cota permitida. Este programa foi agendado para continuar em 24 horas.'
      )
    } else if (!certificateDidSendList.includes(false)) {
      ui.alert('Todos os certificados foram gerados com sucesso')
    } else {
      ui.alert('Alguns certificados não puderam ser gerados, tente novamente mais tarde.')
    }
  } catch (_) {
    if (erroredUsers.length > 0) console.error(erroredUsers)
    console.log(JSON.stringify(ScriptApp.getProjectTriggers()))
  }
}

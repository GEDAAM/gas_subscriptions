import { distributeGroupsFromZero, distributeRemainingVacancies } from './distribution'
import generateGroupsSpreadsheets from './groups_ui'
import separateFormData from './separator'
import setup from './setup'
import triggersSetup from './triggers'
import sendGroupsDataToServer from './updater'

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('GEDAAM')
    .addItem('Separar dados do formulário', 'separateData')
    .addItem('Distribuir grupos do zero', 'distributeGroupsFromZero')
    .addItem('Distribuir vagas remanescentes', 'distributeRemainingVacancies')
    .addItem('Gerar planilhas dos grupos', 'generateSheets')
    .addToUi()
}

global.distributeGroupsFromZero = distributeGroupsFromZero
global.distributeRemainingVacancies = distributeRemainingVacancies
global.generateSheets = generateGroupsSpreadsheets
global.separateData = separateFormData
global.sendGroupsDataToServer = sendGroupsDataToServer

global.setup = setup
global.triggers = triggersSetup

global.onOpen = onOpen
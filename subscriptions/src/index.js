import { distributeGroupsFromZero, distributeRemainingVacancies } from './distribution'
import generateGroupsSpreadsheets from './groups_ui'
import updateUserPresences from './groups_ui/update_presences'
import separateFormData from './separator'
import setup from './setup'
import triggersSetup from './triggers'
import sendGroupsDataToServer from './update_group_opt'

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('GEDAAM')
    .addItem('Separar dados do formulário', 'separateData')
    .addItem('Distribuir grupos do zero', 'distributeGroupsFromZero')
    .addItem('Distribuir vagas remanescentes', 'distributeRemainingVacancies')
    .addItem('Gerar planilhas dos grupos', 'generateSheets')
    .addItem('Atualizar presenças', 'updateUserPresences')
    .addToUi()
}

global.distributeGroupsFromZero = distributeGroupsFromZero
global.distributeRemainingVacancies = distributeRemainingVacancies
global.generateSheets = generateGroupsSpreadsheets
global.separateData = separateFormData
global.updateUserPresences = updateUserPresences

global.setup = setup
global.triggers = triggersSetup

global.sendGroupsDataToServer = sendGroupsDataToServer
global.onOpen = onOpen

import { distributeGroupsFromZero, distributeRemainingVacancies } from './distribution'
import generateGroupsSpreadsheets from './groups_ui'
import updateGroupsSpreadsheets from './groups_ui/sheets_update'
import updateUserPresences from './groups_ui/update_presences'
import mapGroupsSpreadsheets from './patch_groups/updater'
import processCertificatesList from './process_certificates_list'
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
    .addItem('Atualizar planilhas dos grupos', 'updateGroupsSheets')
    .addItem('Atualizar presenças', 'updateUserPresences')
    .addItem('Gerar lista de certificados', 'processCertificatesList')
    .addToUi()
}

global.distributeGroupsFromZero = distributeGroupsFromZero
global.distributeRemainingVacancies = distributeRemainingVacancies
global.generateSheets = generateGroupsSpreadsheets
global.separateData = separateFormData
global.updateUserPresences = updateUserPresences
global.updateGroupsSheets = updateGroupsSpreadsheets
global.patchGroups = mapGroupsSpreadsheets
global.processCertificatesList = processCertificatesList

global.setup = setup
global.triggers = triggersSetup

global.sendGroupsDataToServer = sendGroupsDataToServer // deprecated
global.onOpen = onOpen

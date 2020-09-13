import { distributeGroupsFromZero, distributeRemainingVacancies } from './distribution'
import generateGroupsSpreadsheets from './groups_ui'
import separateFormData from './separator'

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
global.onOpen = onOpen

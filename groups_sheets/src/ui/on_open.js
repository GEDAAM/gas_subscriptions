import showSubscriptionSidebar from '../sidebar'

export function generateMenu() {
  SpreadsheetApp.getUi()
    .createMenu('GEDAAM')
    .addItem('Editar membros', 'showSubscriptionSidebar')
    .addToUi()
}

export default function myOnOpen() {
  generateMenu()
  showSubscriptionSidebar()
}
